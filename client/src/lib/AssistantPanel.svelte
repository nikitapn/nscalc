<script lang="ts">
  import * as NPRPC from "nprpc";
  import * as nscalc from "@rpc/nscalc";
  import { getNscalcRpc } from "./nscalcRpc";
  import { renderMarkdown } from "./markdown";
  import { downscaleImageFile } from "./imageDownscale";
  import type { AssistantCopy } from "./i18n";

  let {
    sessionId = null,
    uiText,
    onSolutionChanged,
    onFertilizerChanged,
  }: {
    sessionId?: string | null;
    uiText: AssistantCopy;
    onSolutionChanged: () => void;
    onFertilizerChanged: () => void;
  } = $props();

  let prompt = $state("");
  let busy = $state(false);
  let statusLabel = $state<string | null>(null);
  let replyMessage = $state<string | null>(null);
  let updatedSolutionName = $state<string | null>(null);
  let updatedFertilizerName = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);

  let attachedImage = $state<{ mimeType: string; data: Uint8Array } | null>(null);
  let attachedImagePreviewUrl = $state<string | null>(null);
  let fileInput: HTMLInputElement | undefined;

  // Not reactive state on purpose — these track the live connection, not
  // anything rendered directly, and are only touched from async callbacks.
  let stream: NPRPC.BidiStream<nscalc.AssistantAsk, nscalc.AssistantEvent> | null = null;
  let streamSessionId: string | null = null;
  let pendingRequestId: string | null = null;

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
        errorMessage = error instanceof Error ? error.message : uiText.errors.unavailable;
      }
    }
  }

  function applyEvent(event: nscalc.AssistantEvent): void {
    switch (event.status) {
      case nscalc.AssistantEventStatus.Thinking:
        statusLabel = uiText.asking;
        break;
      case nscalc.AssistantEventStatus.ToolCall:
        statusLabel = uiText.toolCallLabel(event.detail ?? "");
        break;
      case nscalc.AssistantEventStatus.Done:
        pendingRequestId = null;
        busy = false;
        statusLabel = null;
        replyMessage = event.detail ?? null;
        if (event.solution) {
          updatedSolutionName = event.solution.name;
          onSolutionChanged();
        }
        if (event.fertilizer) {
          updatedFertilizerName = event.fertilizer.name;
          onFertilizerChanged();
        }
        break;
      case nscalc.AssistantEventStatus.Error:
        pendingRequestId = null;
        busy = false;
        statusLabel = null;
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
    replyMessage = null;
    updatedSolutionName = null;
    updatedFertilizerName = null;
    busy = true;
    statusLabel = uiText.asking;

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
      });
      prompt = "";
      clearAttachedImage();
    } catch (error) {
      busy = false;
      statusLabel = null;
      errorMessage = error instanceof Error ? error.message : uiText.errors.unavailable;
    }
  }
</script>

<div class="rounded-[1.75rem] border border-white/10 bg-black/10 p-4 sm:p-5">
  <p class="text-xs font-semibold uppercase tracking-[0.22em] text-ocean-300/75">{uiText.heroEyebrow}</p>
  <h3 class="mt-1 text-lg font-semibold text-white">{uiText.heroTitle}</h3>
  <p class="mt-1 text-sm text-ocean-100/70">{uiText.heroBody}</p>

  {#if !sessionId}
    <p class="mt-3 text-sm text-ocean-100/65">{uiText.loginHint}</p>
  {/if}

  <form class="mt-4 flex flex-col gap-3" onsubmit={(event) => { event.preventDefault(); void ask(); }}>
    <textarea
      bind:value={prompt}
      rows="3"
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
      {#if busy && statusLabel}
        <span class="text-xs text-ocean-100/70">{statusLabel}</span>
      {/if}
    </div>
  </form>

  {#if errorMessage}
    <p class="mt-4 rounded-2xl border border-rose-200/20 bg-rose-950/20 px-3 py-2 text-sm text-rose-100">{errorMessage}</p>
  {:else if replyMessage}
    <div class="mt-4 rounded-2xl border border-emerald-200/20 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-100">
      <div class="assistant-markdown">{@html renderMarkdown(replyMessage)}</div>
      {#if updatedSolutionName}
        <p class="mt-1 text-xs text-emerald-100/75">{uiText.solutionUpdatedLabel(updatedSolutionName)}</p>
      {/if}
      {#if updatedFertilizerName}
        <p class="mt-1 text-xs text-emerald-100/75">{uiText.fertilizerUpdatedLabel(updatedFertilizerName)}</p>
      {/if}
    </div>
  {/if}
</div>

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
