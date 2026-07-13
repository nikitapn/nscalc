<script lang="ts">
  import * as NPRPC from "nprpc";
  import * as nscalc from "@rpc/nscalc";
  import { getNscalcRpc } from "./nscalcRpc";
  import { renderMarkdown } from "./markdown";
  import { downscaleImageFile } from "./imageDownscale";
  import type { AssistantCopy } from "./i18n";
  import {
    clearConversation,
    conversationKeyForUser,
    loadConversation,
    saveConversation,
    type AssistantChatMessage,
  } from "./assistantConversation";

  const OPEN_STORAGE_KEY = "nscalc.assistantOpen";

  let {
    userName = null,
    sessionId = null,
    uiText,
    onSolutionChanged,
    onFertilizerChanged,
  }: {
    userName?: string | null;
    sessionId?: string | null;
    uiText: AssistantCopy;
    onSolutionChanged?: () => void;
    onFertilizerChanged?: () => void;
  } = $props();

  let open = $state(readInitialOpen());
  let fullscreen = $state(false);
  let prompt = $state("");
  let busy = $state(false);
  let statusLabel = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);
  let messages = $state<AssistantChatMessage[]>([]);
  let conversationReady = $state(false);
  let conversationKey = $state(conversationKeyForUser(null));

  // Live-typing preview while a round streams tokens in. Rendering markdown
  // on every single token would flicker (tokens routinely land mid-`**bold`),
  // so the visible streamingText is throttled; rawStreamBuffer accumulates
  // instantly and isn't itself rendered.
  let streamingText = $state("");
  let rawStreamBuffer = "";
  let streamRenderTimer: ReturnType<typeof setTimeout> | null = null;

  let attachedImage = $state<{ mimeType: string; data: Uint8Array } | null>(null);
  let attachedImagePreviewUrl = $state<string | null>(null);
  let fileInput: HTMLInputElement | undefined;
  let messagesEl: HTMLDivElement | undefined;

  // Not reactive state on purpose — these track the live connection, not
  // anything rendered directly, and are only touched from async callbacks.
  let stream: NPRPC.BidiStream<nscalc.AssistantAsk, nscalc.AssistantEvent> | null = null;
  let streamSessionId: string | null = null;
  let pendingRequestId: string | null = null;
  // Metadata collected during the in-flight turn, applied when Done lands.
  let pendingSolutionName: string | null = null;
  let pendingFertilizerName: string | null = null;

  function readInitialOpen(): boolean {
    try {
      const stored = window.localStorage.getItem(OPEN_STORAGE_KEY);
      if (stored === "0") {
        return false;
      }
      if (stored === "1") {
        return true;
      }
    } catch {
      // ignore storage failures (private mode, etc.)
    }
    return true;
  }

  function setOpen(next: boolean): void {
    open = next;
    if (!next) {
      fullscreen = false;
    }
    try {
      window.localStorage.setItem(OPEN_STORAGE_KEY, next ? "1" : "0");
    } catch {
      // ignore
    }
  }

  function setFullscreen(next: boolean): void {
    fullscreen = next;
  }

  function scrollMessagesToBottom(): void {
    queueMicrotask(() => {
      if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    });
  }

  async function persistMessages(next: AssistantChatMessage[]): Promise<void> {
    messages = next;
    scrollMessagesToBottom();
    await saveConversation(conversationKey, next);
  }

  $effect(() => {
    if (!open || !fullscreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFullscreen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  // Load (or switch) the IndexedDB conversation whenever the auth session changes.
  $effect(() => {
    const key = conversationKeyForUser(userName);
    conversationKey = key;
    conversationReady = false;
    let cancelled = false;

    void loadConversation(key).then((loaded) => {
      if (cancelled) {
        return;
      }
      messages = loaded;
      conversationReady = true;
      scrollMessagesToBottom();
    });

    return () => {
      cancelled = true;
    };
  });

  function pushStreamToken(token: string): void {
    rawStreamBuffer += token;
    if (streamRenderTimer) {
      return;
    }
    streamRenderTimer = setTimeout(() => {
      streamingText = rawStreamBuffer;
      streamRenderTimer = null;
      scrollMessagesToBottom();
    }, 80);
  }

  function resetStreamBuffer(): void {
    if (streamRenderTimer) {
      clearTimeout(streamRenderTimer);
      streamRenderTimer = null;
    }
    rawStreamBuffer = "";
    streamingText = "";
  }

  $effect(() => {
    const openedForSessionId = sessionId;
    return () => {
      if (stream && streamSessionId === openedForSessionId) {
        stream.writer.close();
        stream = null;
        streamSessionId = null;
      }
    };
  });

  async function ensureStream(): Promise<NPRPC.BidiStream<nscalc.AssistantAsk, nscalc.AssistantEvent> | null> {
    if (!sessionId) {
      return null;
    }
    if (stream && streamSessionId === sessionId) {
      return stream;
    }

    const { assistant } = await getNscalcRpc();
    const opened = await assistant.Connect(sessionId);
    stream = opened;
    streamSessionId = sessionId;
    void readEvents(opened);
    return opened;
  }

  async function readEvents(activeStream: NPRPC.BidiStream<nscalc.AssistantAsk, nscalc.AssistantEvent>): Promise<void> {
    try {
      for await (const event of activeStream.reader) {
        if (event.request_id !== pendingRequestId) {
          continue;
        }
        applyEvent(event);
      }
    } catch (error) {
      if (busy) {
        busy = false;
        statusLabel = null;
        resetStreamBuffer();
        errorMessage = error instanceof Error ? error.message : uiText.errors.unavailable;
      }
    }
  }

  function applyEvent(event: nscalc.AssistantEvent): void {
    switch (event.status) {
      case nscalc.AssistantEventStatus.Thinking:
        statusLabel = uiText.asking;
        break;
      case nscalc.AssistantEventStatus.Token:
        pushStreamToken(event.detail ?? "");
        break;
      case nscalc.AssistantEventStatus.ToolCall:
        resetStreamBuffer();
        statusLabel = uiText.toolCallLabel(event.detail ?? "");
        break;
      case nscalc.AssistantEventStatus.Done: {
        pendingRequestId = null;
        busy = false;
        statusLabel = null;
        const finalText = (event.detail ?? rawStreamBuffer).trim();
        resetStreamBuffer();
        if (event.solution) {
          pendingSolutionName = event.solution.name;
          onSolutionChanged?.();
        }
        if (event.fertilizer) {
          pendingFertilizerName = event.fertilizer.name;
          onFertilizerChanged?.();
        }
        if (finalText) {
          const assistantMessage: AssistantChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: finalText,
            solutionName: pendingSolutionName,
            fertilizerName: pendingFertilizerName,
            createdAt: Date.now(),
          };
          const priorMessages = $state.snapshot(messages);
          void persistMessages([...priorMessages, assistantMessage]);
        }
        pendingSolutionName = null;
        pendingFertilizerName = null;
        break;
      }
      case nscalc.AssistantEventStatus.Error:
        pendingRequestId = null;
        busy = false;
        statusLabel = null;
        resetStreamBuffer();
        pendingSolutionName = null;
        pendingFertilizerName = null;
        errorMessage = event.detail || uiText.errors.failed;
        break;
    }
  }

  function clearAttachedImage(): void {
    if (attachedImagePreviewUrl) {
      URL.revokeObjectURL(attachedImagePreviewUrl);
    }
    attachedImage = null;
    attachedImagePreviewUrl = null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function onImageSelected(event: Event): Promise<void> {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    errorMessage = null;
    try {
      const downscaled = await downscaleImageFile(file);
      if (attachedImagePreviewUrl) {
        URL.revokeObjectURL(attachedImagePreviewUrl);
      }
      attachedImage = downscaled;
      attachedImagePreviewUrl = URL.createObjectURL(new Blob([downscaled.data], { type: downscaled.mimeType }));
    } catch {
      errorMessage = uiText.errors.invalidImage;
      clearAttachedImage();
    }
  }

  function historyForRequest(prior: AssistantChatMessage[]): nscalc.AssistantHistoryTurn[] {
    return prior
      .filter((message) => message.content.trim().length > 0)
      .map((message) => ({
        role:
          message.role === "user"
            ? nscalc.AssistantMessageRole.User
            : nscalc.AssistantMessageRole.Assistant,
        content: message.content,
      }));
  }

  async function ask(): Promise<void> {
    if (!sessionId) {
      errorMessage = uiText.errors.notLoggedIn;
      return;
    }
    const trimmedPrompt = prompt.trim();
    if ((!trimmedPrompt && !attachedImage) || busy) {
      return;
    }

    errorMessage = null;
    resetStreamBuffer();
    pendingSolutionName = null;
    pendingFertilizerName = null;
    busy = true;
    statusLabel = uiText.asking;

    const userContent =
      trimmedPrompt ||
      (attachedImage ? uiText.photoAttachedNote : "");

    const userMessage: AssistantChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userContent,
      hasImage: Boolean(attachedImage),
      createdAt: Date.now(),
    };

    // Snapshot prior turns before appending the new user message — that is
    // what the model already knows; the new prompt is sent separately.
    const priorMessages = $state.snapshot(messages);
    const nextMessages = [...priorMessages, userMessage];
    await persistMessages(nextMessages);

    try {
      const activeStream = await ensureStream();
      if (!activeStream) {
        errorMessage = uiText.errors.notLoggedIn;
        busy = false;
        statusLabel = null;
        return;
      }
      const requestId = crypto.randomUUID();
      pendingRequestId = requestId;
      await activeStream.writer.write({
        request_id: requestId,
        prompt: trimmedPrompt,
        image: attachedImage ? { mime_type: attachedImage.mimeType, data: attachedImage.data } : undefined,
        history: historyForRequest(priorMessages),
      });
      prompt = "";
      clearAttachedImage();
    } catch (error) {
      busy = false;
      statusLabel = null;
      errorMessage = error instanceof Error ? error.message : uiText.errors.unavailable;
    }
  }

  async function clearChat(): Promise<void> {
    if (busy) {
      return;
    }
    errorMessage = null;
    resetStreamBuffer();
    pendingSolutionName = null;
    pendingFertilizerName = null;
    messages = [];
    await clearConversation(conversationKey);
  }
</script>

{#if open}
  {#if fullscreen}
    <!-- Blurred page backdrop; click to leave full screen -->
    <button
      type="button"
      class="fixed inset-0 z-50 cursor-default border-0 bg-ocean-950/45 backdrop-blur-md"
      aria-label={uiText.exitFullscreen}
      onclick={() => setFullscreen(false)}
    ></button>
  {/if}

  <div
    class={fullscreen
      ? "fixed inset-3 z-[51] flex flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-ocean-950/92 shadow-2xl shadow-black/50 backdrop-blur-xl sm:inset-5 md:inset-8 lg:inset-10 lg:mx-auto lg:max-w-4xl"
      : "fixed bottom-4 right-4 z-50 flex h-[min(36rem,calc(100dvh-2rem))] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-ocean-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"}
    role="dialog"
    aria-modal={fullscreen ? "true" : undefined}
    aria-label={uiText.heroTitle}
  >
    <div class="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-ocean-300/75">{uiText.heroEyebrow}</p>
        <h3 class="mt-0.5 truncate text-base font-semibold text-white sm:text-lg">{uiText.heroTitle}</h3>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        {#if messages.length > 0}
          <button
            type="button"
            class="touch-target rounded-2xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            onclick={() => void clearChat()}
            disabled={busy}
            aria-label={uiText.clearChat}
            title={uiText.clearChat}
          >
            {uiText.clearChat}
          </button>
        {/if}
        <button
          type="button"
          class="touch-target rounded-2xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10"
          onclick={() => setFullscreen(!fullscreen)}
          aria-label={fullscreen ? uiText.exitFullscreen : uiText.expand}
          title={fullscreen ? uiText.exitFullscreen : uiText.expand}
        >
          {#if fullscreen}
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 3v6H3" />
              <path d="M15 3v6h6" />
              <path d="M9 21v-6H3" />
              <path d="M15 21v-6h6" />
              <path d="M9 9 3 3" />
              <path d="m15 9 6-6" />
              <path d="m9 15-6 6" />
              <path d="m15 15 6 6" />
            </svg>
          {:else}
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 9V3h6" />
              <path d="M21 9V3h-6" />
              <path d="M3 15v6h6" />
              <path d="M21 15v6h-6" />
              <path d="M3 3l7 7" />
              <path d="m21 3-7 7" />
              <path d="m3 21 7-7" />
              <path d="m21 21-7-7" />
            </svg>
          {/if}
        </button>
        <button
          type="button"
          class="touch-target rounded-2xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10"
          onclick={() => setOpen(false)}
          aria-label={uiText.hide}
          title={uiText.hide}
        >
          {uiText.hide}
        </button>
      </div>
    </div>

    <div
      bind:this={messagesEl}
      class={`min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5 ${fullscreen ? "sm:p-6 md:px-8" : ""}`}
    >
      {#if conversationReady && messages.length === 0 && !busy}
        <div class={`rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-ocean-100/70 ${fullscreen ? "mx-auto max-w-2xl" : ""}`}>
          <p>{uiText.heroBody}</p>
          <p class="mt-2 text-ocean-100/60">{uiText.emptyChat}</p>
          {#if !sessionId}
            <p class="mt-2 text-ocean-100/65">{uiText.loginHint}</p>
          {/if}
        </div>
      {/if}

      {#each messages as message (message.id)}
        <div class={`flex flex-col gap-1 ${fullscreen ? "mx-auto max-w-2xl" : ""} ${message.role === "user" ? "items-end" : "items-start"}`}>
          <span class="px-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ocean-300/70">
            {message.role === "user" ? uiText.youLabel : uiText.assistantLabel}
          </span>
          <div
            class={`max-w-[95%] rounded-2xl px-3 py-2 text-sm ${
              message.role === "user"
                ? "rounded-br-md bg-ocean-500/35 text-white"
                : "rounded-bl-md border border-white/10 bg-black/25 text-ocean-50"
            }`}
          >
            {#if message.role === "assistant"}
              <div class="assistant-markdown">{@html renderMarkdown(message.content)}</div>
            {:else}
              <p class="whitespace-pre-wrap">{message.content}</p>
            {/if}
            {#if message.hasImage}
              <p class="mt-1 text-xs text-ocean-100/70">{uiText.photoAttachedNote}</p>
            {/if}
            {#if message.solutionName}
              <p class="mt-1 text-xs text-emerald-100/80">{uiText.solutionUpdatedLabel(message.solutionName)}</p>
            {/if}
            {#if message.fertilizerName}
              <p class="mt-1 text-xs text-emerald-100/80">{uiText.fertilizerUpdatedLabel(message.fertilizerName)}</p>
            {/if}
          </div>
        </div>
      {/each}

      {#if busy}
        <div class={`flex flex-col gap-1 items-start ${fullscreen ? "mx-auto max-w-2xl" : ""}`}>
          <span class="px-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ocean-300/70">{uiText.assistantLabel}</span>
          <div class="max-w-[95%] rounded-2xl rounded-bl-md border border-white/10 bg-black/25 px-3 py-2 text-sm text-ocean-50">
            {#if streamingText}
              <div class="assistant-markdown">{@html renderMarkdown(streamingText)}</div>
            {:else}
              <p class="text-ocean-100/70">{statusLabel ?? uiText.asking}</p>
            {/if}
          </div>
        </div>
      {/if}

      {#if errorMessage}
        <p class={`rounded-2xl border border-rose-200/20 bg-rose-950/20 px-3 py-2 text-sm text-rose-100 ${fullscreen ? "mx-auto max-w-2xl" : ""}`}>{errorMessage}</p>
      {/if}
    </div>

    <form
      class={`shrink-0 border-t border-white/10 p-4 sm:px-5 ${fullscreen ? "sm:px-6 md:px-8" : ""}`}
      onsubmit={(event) => { event.preventDefault(); void ask(); }}
    >
      <div class={`flex flex-col gap-3 ${fullscreen ? "mx-auto max-w-2xl" : ""}`}>
        <textarea
          bind:value={prompt}
          rows={fullscreen ? 4 : 2}
          class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30 disabled:opacity-60"
          placeholder={uiText.promptPlaceholder}
          disabled={!sessionId || busy}
        ></textarea>
        <div class="flex flex-wrap items-center gap-3">
          <input
            bind:this={fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden"
            onchange={(event) => void onImageSelected(event)}
            disabled={!sessionId || busy}
          />
          <button
            type="button"
            class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            onclick={() => fileInput?.click()}
            disabled={!sessionId || busy}
          >
            {uiText.attachPhoto}
          </button>
          {#if attachedImagePreviewUrl}
            <div class="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-2 py-1.5">
              <img src={attachedImagePreviewUrl} alt="" class="h-8 w-8 rounded-lg object-cover" />
              <span class="text-xs text-ocean-100/75">{uiText.photoAttached}</span>
              <button
                type="button"
                class="text-xs font-semibold text-rose-200 underline"
                onclick={clearAttachedImage}
                disabled={busy}
              >
                {uiText.removePhoto}
              </button>
            </div>
          {/if}
          <button
            type="submit"
            class="touch-target rounded-2xl bg-sand-200 px-4 text-sm font-semibold text-ocean-950 transition hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!sessionId || busy || (!prompt.trim() && !attachedImage)}
          >
            {busy ? uiText.asking : uiText.ask}
          </button>
          {#if busy && statusLabel && !streamingText}
            <span class="text-xs text-ocean-100/70">{statusLabel}</span>
          {/if}
        </div>
      </div>
    </form>
  </div>
{:else}
  <button
    type="button"
    class="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-ocean-500 text-white shadow-2xl shadow-black/40 transition hover:scale-105 hover:bg-ocean-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-200"
    onclick={() => setOpen(true)}
    aria-label={uiText.open}
    title={uiText.open}
  >
    <!-- Sparkle / AI mark -->
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5l1.35 5.15L18.5 9l-5.15 1.35L12 15.5l-1.35-5.15L5.5 9l5.15-1.35L12 2.5z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M18.5 13.5l.7 2.65L22 16.9l-2.8.75-.7 2.65-.7-2.65-2.8-.75 2.8-.75.7-2.65z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M6.2 15l.55 2.1L8.9 17.7l-2.15.55-.55 2.1-.55-2.1-2.15-.55 2.15-.6.55-2.1z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
    {#if busy}
      <span class="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-sand-200 ring-2 ring-ocean-950" aria-hidden="true"></span>
    {/if}
  </button>
{/if}

<style>
  .assistant-markdown :global(p) {
    margin: 0 0 0.5rem;
  }
  .assistant-markdown :global(p:last-child) {
    margin-bottom: 0;
  }
  .assistant-markdown :global(ul),
  .assistant-markdown :global(ol) {
    margin: 0 0 0.5rem;
    padding-left: 1.25rem;
  }
  .assistant-markdown :global(ul) {
    list-style-type: disc;
  }
  .assistant-markdown :global(ol) {
    list-style-type: decimal;
  }
  .assistant-markdown :global(li) {
    margin: 0.15rem 0;
  }
  .assistant-markdown :global(strong) {
    font-weight: 600;
    color: white;
  }
  .assistant-markdown :global(code) {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.25rem;
    padding: 0.1rem 0.3rem;
    font-size: 0.85em;
  }
  .assistant-markdown :global(pre) {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.75rem;
    padding: 0.6rem 0.75rem;
    overflow-x: auto;
    margin: 0 0 0.5rem;
  }
  .assistant-markdown :global(pre code) {
    background: none;
    padding: 0;
  }
  .assistant-markdown :global(a) {
    color: inherit;
    text-decoration: underline;
  }
</style>
