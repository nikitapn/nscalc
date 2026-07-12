<script lang="ts">
  import * as NPRPC from "nprpc";
  import { onMount } from "svelte";
  import Calculator from "./view/Calculator.svelte";
  import Journal from "./view/Journal.svelte";
  import Solutions from "./view/Solutions.svelte";
  import Fertilizers from "./view/Fertilizers.svelte";
  import AssistantPanel from "./lib/AssistantPanel.svelte";
  import { localeLabels, resolveLocale, translations, type Locale } from "./lib/i18n";
  import {
    createDefaultSiteEventConfig,
    getSiteEventSessionSignature,
    isSiteEventActive,
    parseSiteEventConfig,
    stringifySiteEventConfig,
    type SiteEventConfig,
  } from "./lib/adminEvents";
  import { getCookie, setCookie } from "./lib/cookies";
  import { getNscalcRpc } from "./lib/nscalcRpc";
  import { invalidateFertilizersCatalogCache, invalidateSolutionsCatalogCache } from "./lib/catalogRpcCache";
  import { applySeasonalTheme, seasonForVariant } from "./lib/seasonalTheme";
  import * as nscalc from "@rpc/nscalc";

  type AuthState = {
    name: string;
    sessionId: string;
    isAdmin: boolean;
    registeredUser: nscalc.RegisteredUser;
  } | null;

  type View = "journal" | "calculator" | "solutions" | "fertilizers" | "chat" | "about";

  type FireworksOverlayController = {
    stop(): void;
  };

  type SnapshotCard = {
    label: string;
    value: string;
    detail: string;
  };

  const availableLocales: Locale[] = ["en", "ru"];

  let mobileMenuEnabled = $state(false);
  let locale = $state<Locale>("en");
  let currentView = $state<View>("journal");
  let email = $state("superuser@nscalc.com");
  let password = $state("1234");
  let authState = $state<AuthState>(null);
  let authBusy = $state(false);
  let authError = $state<string | null>(null);
  let eventConfig = $state<SiteEventConfig>(createDefaultSiteEventConfig());
  let eventDraft = $state<SiteEventConfig>(createDefaultSiteEventConfig());
  let eventLoading = $state(true);
  let eventSaving = $state(false);
  let eventPanelOpen = $state(false);
  let eventMessage = $state<string | null>(null);
  let eventRuntimeBusy = $state(false);
  let eventRuntime = $state<FireworksOverlayController | null>(null);

  const copy = $derived(translations[locale]);
  const navItems = $derived.by<Array<{ id: View; label: string; blurb: string }>>(() => [
    { id: "journal", label: copy.nav.journal.label, blurb: copy.nav.journal.blurb },
    { id: "calculator", label: copy.nav.calculator.label, blurb: copy.nav.calculator.blurb },
    { id: "solutions", label: copy.nav.solutions.label, blurb: copy.nav.solutions.blurb },
    { id: "fertilizers", label: copy.nav.fertilizers.label, blurb: copy.nav.fertilizers.blurb },
    { id: "chat", label: copy.nav.chat.label, blurb: copy.nav.chat.blurb },
    { id: "about", label: copy.nav.about.label, blurb: copy.nav.about.blurb },
  ]);

  function changeView(view: View) {
    mobileMenuEnabled = false;
    currentView = view;
  }

  function applyLocale(next: Locale): void {
    locale = next;
    window.localStorage.setItem("nscalc.locale", next);
  }

  const activeItem = $derived(navItems.find((item) => item.id === currentView) ?? navItems[0]);
  const eventIsLive = $derived(isSiteEventActive(eventConfig));
  const eventWindowLabel = $derived(getEventWindowLabel(eventConfig));
  const eventDraftDirty = $derived(JSON.stringify(eventDraft) !== JSON.stringify(eventConfig));
  const accountLabel = $derived(authState ? authState.name : copy.app.snapshot.values.guest);
  const accessLabel = $derived(
    authState?.isAdmin
      ? copy.app.snapshot.values.admin
      : authState
        ? copy.app.snapshot.values.signedIn
        : copy.app.snapshot.values.guest,
  );
  const eventStatusLabel = $derived(
    eventLoading
      ? copy.app.snapshot.values.loading
      : eventIsLive
        ? copy.app.snapshot.values.liveNow
        : eventConfig.enabled
          ? copy.app.snapshot.values.scheduled
          : copy.app.snapshot.values.inactive,
  );
  const snapshotCards = $derived.by<SnapshotCard[]>(() => {
    const snapshot = copy.app.snapshot;

    switch (currentView) {
      case "journal":
        return [
          {
            label: snapshot.labels.account,
            value: accountLabel,
            detail: authState?.isAdmin ? snapshot.details.journalAdminAccount : authState ? snapshot.details.journalSignedInAccount : snapshot.details.journalGuestAccount,
          },
          {
            label: snapshot.labels.journalMode,
            value: authState?.isAdmin ? snapshot.values.moderation : snapshot.values.reader,
            detail: authState?.isAdmin ? snapshot.details.journalModerationMode : snapshot.details.journalReaderMode,
          },
          {
            label: snapshot.labels.sharedEvent,
            value: eventStatusLabel,
            detail: eventLoading ? snapshot.details.sharedEventRefreshing : `${siteEventVariantLabel(eventConfig.variant)} • ${eventWindowLabel}`,
          },
          {
            label: snapshot.labels.eventDraft,
            value: eventDraftDirty ? snapshot.values.unsaved : snapshot.values.synced,
            detail: authState?.isAdmin ? (eventDraftDirty ? snapshot.details.eventDraftStaged : snapshot.details.eventDraftSynced) : snapshot.details.eventDraftReadonly,
          },
        ];
      case "solutions":
        return [
          {
            label: snapshot.labels.account,
            value: accountLabel,
            detail: authState ? snapshot.details.solutionsAccountSignedIn : snapshot.details.solutionsAccountGuest,
          },
          {
            label: snapshot.labels.libraryAccess,
            value: authState ? snapshot.values.personalShared : snapshot.values.sharedOnly,
            detail: authState ? snapshot.details.solutionsLibrarySignedIn : snapshot.details.solutionsLibraryGuest,
          },
          {
            label: snapshot.labels.primaryUse,
            value: snapshot.values.targetRecipes,
            detail: snapshot.details.solutionsPrimaryUse,
          },
          {
            label: snapshot.labels.workflow,
            value: authState ? snapshot.values.editable : snapshot.values.readOnly,
            detail: authState ? snapshot.details.solutionsWorkflowSignedIn : snapshot.details.solutionsWorkflowGuest,
          },
        ];
      case "fertilizers":
        return [
          {
            label: snapshot.labels.account,
            value: accountLabel,
            detail: authState ? snapshot.details.fertilizersAccountSignedIn : snapshot.details.fertilizersAccountGuest,
          },
          {
            label: snapshot.labels.catalogAccess,
            value: authState ? snapshot.values.personalShared : snapshot.values.sharedOnly,
            detail: authState ? snapshot.details.fertilizersCatalogSignedIn : snapshot.details.fertilizersCatalogGuest,
          },
          {
            label: snapshot.labels.primaryUse,
            value: snapshot.values.elementRatios,
            detail: snapshot.details.fertilizersPrimaryUse,
          },
          {
            label: snapshot.labels.workflow,
            value: authState ? snapshot.values.editable : snapshot.values.readOnly,
            detail: authState ? snapshot.details.fertilizersWorkflowSignedIn : snapshot.details.fertilizersWorkflowGuest,
          },
        ];
      case "chat":
        return [
          {
            label: snapshot.labels.account,
            value: accountLabel,
            detail: authState ? snapshot.details.chatAccountSignedIn : snapshot.details.chatAccountGuest,
          },
          {
            label: snapshot.labels.status,
            value: snapshot.values.planned,
            detail: snapshot.details.chatStatus,
          },
          {
            label: snapshot.labels.context,
            value: accessLabel,
            detail: authState?.isAdmin ? snapshot.details.chatContextAdmin : snapshot.details.chatContextUser,
          },
          {
            label: snapshot.labels.nextStep,
            value: snapshot.values.realtimeSync,
            detail: snapshot.details.chatNextStep,
          },
        ];
      case "about":
        return [
          {
            label: snapshot.labels.currentView,
            value: activeItem.label,
            detail: activeItem.blurb,
          },
          {
            label: snapshot.labels.account,
            value: accountLabel,
            detail: authState?.isAdmin ? snapshot.details.aboutAccountAdmin : authState ? snapshot.details.aboutAccountSignedIn : snapshot.details.aboutAccountGuest,
          },
          {
            label: snapshot.labels.experience,
            value: snapshot.values.mobileFirst,
            detail: snapshot.details.aboutExperience,
          },
          {
            label: snapshot.labels.sharedEvent,
            value: eventStatusLabel,
            detail: eventLoading ? snapshot.details.sharedEventStateRefreshing : `${siteEventVariantLabel(eventConfig.variant)} • ${eventWindowLabel}`,
          },
        ];
      default:
        return [];
    }
  });

  function siteEventVariantLabel(variant: SiteEventConfig["variant"]): string {
    return copy.app.event.variants[variant];
  }

  function siteEventVariantDescription(variant: SiteEventConfig["variant"]): string {
    return copy.app.event.descriptions[variant];
  }

  function formatEventDateTime(value: string): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsed);
  }

  function getEventWindowLabel(config: SiteEventConfig): string {
    const startsAt = config.startAt ? new Date(config.startAt) : null;
    const endsAt = config.endAt ? new Date(config.endAt) : null;

    const hasStart = startsAt !== null && !Number.isNaN(startsAt.getTime());
    const hasEnd = endsAt !== null && !Number.isNaN(endsAt.getTime());

    if (hasStart && hasEnd) {
      return copy.app.event.windowRange(formatEventDateTime(config.startAt), formatEventDateTime(config.endAt));
    }

    if (hasStart) {
      return copy.app.event.windowStarts(formatEventDateTime(config.startAt));
    }

    if (hasEnd) {
      return copy.app.event.windowEnds(formatEventDateTime(config.endAt));
    }

    return copy.app.event.windowAutoplay;
  }

  function getEventLastUpdate(config: SiteEventConfig): string {
    const updatedAt = config.updatedAt ? formatEventDateTime(config.updatedAt) : copy.app.event.notYetSaved;
    return copy.app.event.lastUpdate(updatedAt, config.updatedBy);
  }

  onMount(() => {
    applyLocale(resolveLocale(window.localStorage.getItem("nscalc.locale") ?? window.navigator.language));
    let refreshTimer = window.setInterval(() => {
      void loadSiteEventConfig(false);
    }, 60_000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadSiteEventConfig(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    void loadSiteEventConfig(true);
    void restoreSession();

    return () => {
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      stopFireworks(copy.app.event.eventStoppedMessage);
    };
  });

  async function restoreSession(): Promise<void> {
    const sessionId = getCookie("sid");
    if (!sessionId) {
      return;
    }

    authBusy = true;
    authError = null;
    try {
      const { authorizator } = await getNscalcRpc();
      const userData = await authorizator.LogInWithSessionId(sessionId);
      authState = {
        name: userData.name,
        sessionId: userData.sessionId,
        isAdmin: userData.isAdmin,
        registeredUser: NPRPC.narrow(userData.db, nscalc.RegisteredUser),
      };
      setCookie("sid", userData.sessionId);
    } catch {
      setCookie("sid", null);
      authState = null;
    } finally {
      authBusy = false;
    }
  }

  async function logIn(): Promise<void> {
    if (!email.trim() || !password.trim()) {
      authError = copy.app.auth.enterCredentials;
      return;
    }

    authBusy = true;
    authError = null;
    try {
      const { authorizator } = await getNscalcRpc();
      const userData = await authorizator.LogIn(email.trim(), password);
      authState = {
        name: userData.name,
        sessionId: userData.sessionId,
        isAdmin: userData.isAdmin,
        registeredUser: NPRPC.narrow(userData.db, nscalc.RegisteredUser),
      };
      setCookie("sid", userData.sessionId);
      password = "";
    } catch (error) {
      authState = null;
      if (error instanceof nscalc.AuthorizationFailed) {
        const reason = () => {
          switch (error.reason) {
            case nscalc.AuthorizationFailed_Reason.email_does_not_exist:
              return copy.app.auth.noAccountForEmail;
            case nscalc.AuthorizationFailed_Reason.incorrect_password:
              return copy.app.auth.incorrectPassword;
            default:
              return copy.app.auth.unknownError;
          }
        };
        authError = `${copy.app.auth.loginFailedPrefix} ${reason()}`;
      } else {
        authError = error instanceof Error ? error.message : copy.app.auth.loginFailed;
      }
    } finally {
      authBusy = false;
    }
  }

  async function logOut(): Promise<void> {
    const sessionId = authState?.sessionId ?? getCookie("sid");
    authBusy = true;
    authError = null;
    try {
      if (sessionId) {
        const { authorizator } = await getNscalcRpc();
        await authorizator.LogOut(sessionId);
      }
    } catch (error) {
      authError = error instanceof Error ? error.message : copy.app.auth.logoutFailed;
    } finally {
      setCookie("sid", null);
      authState = null;
      authBusy = false;
    }
  }

  function clearEventWindow(): void {
    eventDraft.startAt = "";
    eventDraft.endAt = "";
    eventMessage = copy.app.event.clearScheduleMessage;
  }

  function resetEventDraft(): void {
    eventDraft = { ...eventConfig };
    eventMessage = copy.app.event.resetDraftMessage;
  }

  function stopFireworks(message = copy.app.event.stopPreviewMessage): void {
    if (!eventRuntime) {
      return;
    }
    const activeRuntime = eventRuntime;
    eventRuntime = null;
    eventMessage = message;
    activeRuntime.stop();
  }

  async function startEventPlayback(trigger: "preview" | "auto", config: SiteEventConfig): Promise<boolean> {
    if (eventRuntimeBusy) {
      return false;
    }

    if (eventRuntime) {
      eventMessage = trigger === "preview" ? copy.app.event.alreadyRunning : eventMessage;
      return false;
    }

    eventRuntimeBusy = true;
    eventMessage = trigger === "preview" ? copy.app.event.loadingPreview : copy.app.event.loadingSeasonal;

    try {
      let stoppedManually = false;
      const handleFinish = () => {
        eventRuntime = null;
        if (!stoppedManually) {
          eventMessage = trigger === "preview" ? copy.app.event.previewFinished : copy.app.event.completed(siteEventVariantLabel(config.variant));
        }
      };
      const runtime = config.variant === "snow"
        ? (await import("./lib/eventEffects/snowRuntime")).launchSnowOverlay({
            durationSeconds: config.durationSeconds,
            intensity: config.intensity,
            onFinish: handleFinish,
          })
        : config.variant === "petals"
        ? (await import("./lib/eventEffects/petalsRuntime")).launchPetalsOverlay({
            durationSeconds: config.durationSeconds,
            intensity: config.intensity,
            onFinish: handleFinish,
          })
        : (await import("./lib/eventEffects/fireworksRuntime")).launchFireworksOverlay({
            durationSeconds: config.durationSeconds,
            intensity: config.intensity,
            onFinish: handleFinish,
          });
      eventRuntime = {
        stop() {
          stoppedManually = true;
          runtime.stop();
        },
      };
      eventMessage = trigger === "preview" ? copy.app.event.previewLive(siteEventVariantLabel(config.variant)) : copy.app.event.triggered(siteEventVariantLabel(config.variant));
      return true;
    } catch (error) {
      eventRuntime = null;
      eventMessage = error instanceof Error ? error.message : copy.app.event.unableToStart;
      return false;
    } finally {
      eventRuntimeBusy = false;
    }
  }

  async function loadSiteEventConfig(showLoadingState: boolean): Promise<void> {
    if (showLoadingState) {
      eventLoading = true;
    }

    try {
      const { siteEvents } = await getNscalcRpc();
      const configJSON = await siteEvents.http.GetSiteEventConfig();
      const config = parseSiteEventConfig(configJSON);
      eventConfig = config;
      if (!authState?.isAdmin || !eventDraftDirty) {
        eventDraft = { ...config };
      }
      if (config.enabled && isSiteEventActive(config)) {
        applySeasonalTheme(seasonForVariant(config.variant));
      }
      await maybeAutoplayEvent(config);
    } catch (error) {
      if (showLoadingState) {
        eventMessage = error instanceof Error ? error.message : copy.app.event.unableLoad;
      }
    } finally {
      eventLoading = false;
    }
  }

  async function saveSiteEventConfig(): Promise<void> {
    const sessionId = authState?.sessionId;
    if (!sessionId) {
      eventMessage = copy.app.event.adminRequiredSave;
      return;
    }

    eventSaving = true;
    eventMessage = copy.app.event.savingSharedConfig;

    try {
      const { siteEvents } = await getNscalcRpc();
      const savedJSON = await siteEvents.http.SetSiteEventConfig(sessionId, stringifySiteEventConfig(eventDraft));
      const savedConfig = parseSiteEventConfig(savedJSON);
      eventConfig = savedConfig;
      eventDraft = { ...savedConfig };
      eventMessage = copy.app.event.savedForVisitors(siteEventVariantLabel(savedConfig.variant));
      applySeasonalTheme(savedConfig.enabled && isSiteEventActive(savedConfig) ? seasonForVariant(savedConfig.variant) : "default");
      await maybeAutoplayEvent(savedConfig);
    } catch (error) {
      if (error instanceof nscalc.AuthorizationFailed) {
        eventMessage = copy.app.event.adminExpired;
      } else if (error instanceof nscalc.PermissionViolation) {
        eventMessage = error.msg;
      } else if (error instanceof nscalc.InvalidArgument) {
        eventMessage = error.msg;
      } else {
        eventMessage = error instanceof Error ? error.message : copy.app.event.unableSave;
      }
    } finally {
      eventSaving = false;
    }
  }

  async function maybeAutoplayEvent(config = eventConfig): Promise<void> {
    if (!config.enabled || !config.autoPlay || !isSiteEventActive(config)) {
      return;
    }

    const signature = getSiteEventSessionSignature(config);
    if (window.sessionStorage.getItem("nscalc.site-event-autoplay") === signature) {
      return;
    }

    const started = await startEventPlayback("auto", config);
    if (started) {
      window.sessionStorage.setItem("nscalc.site-event-autoplay", signature);
    }
  }
</script>

<svelte:head>
  <title>{copy.headTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="relative min-h-screen overflow-hidden">
  <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,198,255,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(201,138,53,0.12),transparent_18%)]"></div>

  <header class="sticky top-0 z-20 border-b border-white/10 bg-ocean-900/80 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 2xl:max-w-384">
      <div class="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between 2xl:gap-6">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-ocean-300">{copy.shell.brandEyebrow}</p>
          <h1 class="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{copy.shell.heroTitle}</h1>
          <p class="mt-3 text-sm leading-6 text-ocean-100/80 sm:text-base">{copy.shell.heroBody}</p>
        </div>

        <form class="panel-surface hairline grid w-full gap-3 rounded-3xl p-3 sm:grid-cols-2 lg:max-w-3xl lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] lg:items-end xl:max-w-184" onsubmit={(event) => { event.preventDefault(); void logIn(); }}>
          <label class="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-ocean-200/70">
            {copy.shell.email}
            <input bind:value={email} class="touch-target min-w-0 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30" type="email" placeholder={copy.shell.emailPlaceholder} />
          </label>
          <label class="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-ocean-200/70">
            {copy.shell.password}
            <input bind:value={password} class="touch-target min-w-0 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30" type="password" placeholder={copy.shell.passwordPlaceholder} />
          </label>
          <button type="submit" class="touch-target rounded-2xl bg-ocean-400 px-4 text-sm font-semibold text-ocean-950 transition hover:bg-ocean-300 lg:self-end" disabled={authBusy}>{authBusy ? copy.shell.working : authState ? copy.shell.refreshLogin : copy.shell.logIn}</button>
          {#if authState}
            <button type="button" class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 lg:self-end" onclick={() => void logOut()} disabled={authBusy}>{copy.shell.logOut}</button>
          {:else}
            <button type="button" class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 lg:self-end" disabled>{copy.shell.register}</button>
          {/if}
          <div class="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-3">
            <div class="text-xs text-ocean-100/80">
              {#if authState}
                <p>{copy.shell.signedInAs} {authState.name}{authState.isAdmin ? ` • ${copy.shell.moderatorEnabled}` : ""}.</p>
              {/if}
              {#if authError}
                <p class:mt-1={authState !== null} class="text-rose-200">{authError}</p>
              {/if}
            </div>

            <div class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ocean-200/70">
              <span>{copy.shell.language}</span>
              <div class="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1">
                {#each availableLocales as availableLocale}
                  <button
                    type="button"
                    class={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${locale === availableLocale ? 'bg-sand-200 text-ocean-950' : 'text-ocean-100/75 hover:bg-white/8'}`}
                    onclick={() => applyLocale(availableLocale)}
                  >
                    {localeLabels[availableLocale]}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </form>
      </div>

      {#if eventConfig.enabled}
        <div class="mt-4 rounded-3xl border border-sand-200/22 bg-sand-200/10 px-4 py-3 text-sm text-sand-50">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-sand-100/85">{copy.app.event.seasonalEvent}</p>
              <p class="mt-1 font-semibold text-white">{siteEventVariantLabel(eventConfig.variant)} {eventIsLive ? copy.app.event.isLiveNow : copy.app.event.isArmed}.</p>
              <p class="mt-1 text-xs text-sand-100/78">{eventWindowLabel}</p>
            </div>
            {#if authState?.isAdmin}
              <button
                type="button"
                class="touch-target rounded-2xl border border-white/15 bg-white/8 px-4 text-sm font-semibold text-white transition hover:bg-white/12"
                onclick={() => (eventPanelOpen = !eventPanelOpen)}
              >
                {eventPanelOpen ? copy.app.event.hideEventPanel : copy.app.event.manageEvent}
              </button>
            {/if}
          </div>
        </div>
      {/if}

      <div class="mt-5 flex items-center justify-between md:hidden">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-ocean-300/80">{copy.shell.currentView}</p>
          <p class="mt-1 text-lg font-semibold text-white">{activeItem.label}</p>
        </div>
        <button
          type="button"
          class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
          onclick={() => (mobileMenuEnabled = !mobileMenuEnabled)}
        >
          {mobileMenuEnabled ? copy.shell.closeMenu : copy.shell.openMenu}
        </button>
      </div>

      <nav class:mt-5={true} class:hidden={!mobileMenuEnabled} class="hidden md:block">
        <div class="flex flex-wrap gap-2 pb-1">
          {#each navItems as item}
            <button
              type="button"
              class={`touch-target min-w-56 flex-1 rounded-2xl px-4 py-3 text-left text-sm font-medium transition lg:min-w-0 lg:flex-none ${currentView === item.id ? 'bg-sand-200 text-ocean-950' : 'bg-white/5 text-ocean-50 hover:bg-white/10'}`}
              onclick={() => changeView(item.id)}
            >
              <span class="block font-semibold">{item.label}</span>
              <span class={`mt-1 block text-xs ${currentView === item.id ? 'text-ocean-800/80' : 'text-ocean-100/65'}`}>{item.blurb}</span>
            </button>
          {/each}
        </div>
      </nav>
    </div>
  </header>

  <main class="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 2xl:max-w-384">
    <section class={`grid gap-4 ${currentView === "calculator" ? 'grid-cols-1' : '2xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:items-start'}`}>
      <div class={`panel-surface relative rounded-4xl p-4 sm:p-6 ${currentView === "journal" ? 'z-30' : ''}`}>
        {#if currentView === "journal"}
            <Journal moderatorSessionId={authState?.sessionId ?? null} canModerate={authState?.isAdmin ?? false} moderatorName={authState?.name ?? null} locale={locale} uiText={copy.journal} />
        {:else if currentView === "calculator"}
          <Calculator currentUser={authState?.registeredUser ?? null} uiText={copy.calculator} />
        {:else if currentView === "solutions"}
          <Solutions currentUserName={authState?.name ?? null} currentUser={authState?.registeredUser ?? null} sessionId={authState?.sessionId ?? null} uiText={copy.solutions} />
        {:else if currentView === "fertilizers"}
          <Fertilizers currentUserName={authState?.name ?? null} currentUser={authState?.registeredUser ?? null} uiText={copy.fertilizers} />
        {:else if currentView === "chat"}
          <div class="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{copy.app.chat.eyebrow}</p>
              <h2 class="mt-2 text-2xl font-semibold text-white">{copy.app.chat.title}</h2>
              <p class="mt-3 text-sm leading-6 text-ocean-100/80">{copy.app.chat.body}</p>
            </div>
            <div class="rounded-[1.75rem] border border-white/10 bg-black/20 p-4">
              <div class="space-y-3">
                <div class="ml-auto max-w-[80%] rounded-3xl rounded-br-md bg-ocean-400 px-4 py-3 text-sm text-ocean-950">{copy.app.chat.outgoingMessage}</div>
                <div class="max-w-[82%] rounded-3xl rounded-bl-md bg-white/10 px-4 py-3 text-sm text-ocean-50">{copy.app.chat.incomingMessage}</div>
              </div>
              <div class="mt-4 flex gap-3">
                <input class="touch-target min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-ocean-300" placeholder={copy.app.chat.placeholder} />
                <button type="button" class="touch-target rounded-2xl bg-sand-200 px-4 text-sm font-semibold text-ocean-950">{copy.app.chat.send}</button>
              </div>
            </div>
          </div>
        {:else}
          <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{copy.about.eyebrow}</p>
              <h2 class="mt-2 text-2xl font-semibold text-white">{copy.about.title}</h2>
              <p class="mt-3 text-sm leading-6 text-ocean-100/80">{copy.about.body}</p>
            </div>
            <div class="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 text-sm leading-6 text-ocean-100/80">
              <p>{copy.about.aside}</p>
            </div>
          </div>
        {/if}
      </div>

      {#if currentView !== "calculator" || authState?.isAdmin}
        <aside class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
          {#if authState?.isAdmin}
            <section class="panel-surface rounded-4xl p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{copy.app.event.adminEyebrow}</p>
                  <h2 class="mt-2 text-xl font-semibold text-white">{copy.app.event.adminTitle}</h2>
                  <p class="mt-2 text-sm leading-6 text-ocean-100/78">{copy.app.event.adminBody}</p>
                </div>
                <button
                  type="button"
                  class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                  onclick={() => (eventPanelOpen = !eventPanelOpen)}
                >
                  {eventPanelOpen ? copy.app.event.collapse : copy.app.event.expand}
                </button>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div class="rounded-3xl bg-black/20 p-4">
                  <p class="text-ocean-100/70">{copy.app.event.runtime}</p>
                  <p class="mt-1 text-lg font-semibold text-white">{eventRuntime ? copy.app.event.runtimeLive : copy.app.event.runtimeIdle}</p>
                </div>
                <div class="rounded-3xl bg-black/20 p-4">
                  <p class="text-ocean-100/70">{copy.app.event.schedule}</p>
                  <p class="mt-1 text-lg font-semibold text-white">{eventIsLive ? copy.app.event.scheduleActive : eventConfig.enabled ? copy.app.event.scheduleArmed : copy.app.event.scheduleOff}</p>
                </div>
              </div>

              {#if eventPanelOpen}
                <div class="mt-5 space-y-4 rounded-[1.75rem] border border-white/10 bg-black/18 p-4">
                  <div class="rounded-3xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-ocean-50">
                    <p class="font-semibold text-white">{copy.app.event.sharedServerEvent}</p>
                    <p class="mt-1 text-xs text-ocean-100/70">{eventLoading ? copy.app.event.loadingFromServer : getEventLastUpdate(eventConfig)}</p>
                  </div>

                  <label class="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-ocean-200/70">
                    {copy.app.event.variant}
                    <select bind:value={eventDraft.variant} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30">
                      <option value="fireworks">{copy.app.event.variants.fireworks}</option>
                      <option value="snow">{copy.app.event.variants.snow}</option>
                      <option value="petals">{copy.app.event.variants.petals}</option>
                    </select>
                  </label>

                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-ocean-50">
                    <div>
                      <span class="block font-semibold text-white">{copy.app.event.enableSharedEvent}</span>
                      <span class="mt-1 block text-xs text-ocean-100/70">{copy.app.event.enableSharedEventHelp}</span>
                    </div>
                    <input bind:checked={eventDraft.enabled} class="h-5 w-5 accent-sand-200" type="checkbox" />
                  </label>

                  <label class="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-ocean-50">
                    <div>
                      <span class="block font-semibold text-white">{copy.app.event.autoplay}</span>
                      <span class="mt-1 block text-xs text-ocean-100/70">{copy.app.event.autoplayHelp}</span>
                    </div>
                    <input bind:checked={eventDraft.autoPlay} class="h-5 w-5 accent-sand-200" type="checkbox" />
                  </label>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-ocean-200/70">
                      {copy.app.event.starts}
                      <input bind:value={eventDraft.startAt} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30" type="datetime-local" />
                    </label>
                    <label class="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-ocean-200/70">
                      {copy.app.event.ends}
                      <input bind:value={eventDraft.endAt} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30" type="datetime-local" />
                    </label>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-ocean-200/70">
                      {copy.app.event.duration}
                      <select bind:value={eventDraft.durationSeconds} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30">
                        <option value={10}>{copy.app.event.durationOptions.ten}</option>
                        <option value={18}>{copy.app.event.durationOptions.eighteen}</option>
                        <option value={24}>{copy.app.event.durationOptions.twentyFour}</option>
                        <option value={30}>{copy.app.event.durationOptions.thirty}</option>
                      </select>
                    </label>
                    <label class="flex flex-col gap-1 text-xs font-medium uppercase tracking-[0.2em] text-ocean-200/70">
                      {copy.app.event.intensity}
                      <select bind:value={eventDraft.intensity} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-ocean-300 focus:bg-black/30">
                        <option value="gentle">{copy.app.event.intensities.gentle}</option>
                        <option value="showtime">{copy.app.event.intensities.showtime}</option>
                      </select>
                    </label>
                  </div>

                  <div class="rounded-3xl border border-sand-200/18 bg-sand-200/8 px-4 py-3 text-sm text-sand-50">
                    <p class="font-semibold text-white">{siteEventVariantLabel(eventDraft.variant)}</p>
                    <p class="mt-1 text-xs text-sand-100/80">{siteEventVariantDescription(eventDraft.variant)}</p>
                    <p class="mt-2 text-xs text-sand-100/75">{getEventWindowLabel(eventDraft)}</p>
                  </div>

                  <div class="flex flex-wrap gap-3">
                    <button
                      type="button"
                      class="touch-target rounded-2xl bg-sand-200 px-4 text-sm font-semibold text-ocean-950 transition hover:bg-sand-100"
                      onclick={() => void startEventPlayback("preview", eventDraft)}
                      disabled={eventRuntimeBusy}
                    >
                      {eventRuntimeBusy ? copy.shell.working : copy.app.event.previewVariant(siteEventVariantLabel(eventDraft.variant))}
                    </button>
                    <button
                      type="button"
                      class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                      onclick={() => stopFireworks()}
                      disabled={!eventRuntime}
                    >
                      {copy.app.event.stopPreview}
                    </button>
                    <button
                      type="button"
                      class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                      onclick={clearEventWindow}
                    >
                      {copy.app.event.clearSchedule}
                    </button>
                    <button
                      type="button"
                      class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                      onclick={resetEventDraft}
                      disabled={!eventDraftDirty}
                    >
                      {copy.app.event.resetDraft}
                    </button>
                    <button
                      type="button"
                      class="touch-target rounded-2xl bg-ocean-400 px-4 text-sm font-semibold text-ocean-950 transition hover:bg-ocean-300"
                      onclick={() => void saveSiteEventConfig()}
                      disabled={eventSaving || !eventDraftDirty}
                    >
                      {eventSaving ? copy.app.event.savingSharedEvent : copy.app.event.saveSharedEvent}
                    </button>
                  </div>

                  {#if eventMessage}
                    <p class="text-sm text-ocean-100/80">{eventMessage}</p>
                  {/if}
                </div>
              {/if}
            </section>
          {/if}

          {#if currentView !== "calculator"}
            <section class="panel-surface rounded-4xl p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{activeItem.label} {copy.app.snapshot.titleSuffix}</p>
                  <p class="mt-2 text-sm leading-6 text-ocean-100/72">{activeItem.blurb}</p>
                </div>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                {#each snapshotCards as card}
                  <div class="rounded-3xl bg-black/20 p-4">
                    <p class="text-ocean-100/70">{card.label}</p>
                    <p class="mt-1 text-lg font-semibold text-white">{card.value}</p>
                    <p class="mt-2 text-xs leading-5 text-ocean-100/68">{card.detail}</p>
                  </div>
                {/each}
              </div>
            </section>

            <section class="panel-surface rounded-4xl p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{copy.app.priorities.title}</p>
              <ol class="mt-4 space-y-3 text-sm leading-6 text-ocean-100/80">
                {#each copy.app.priorities.items as priority}
                  <li>{priority}</li>
                {/each}
              </ol>
            </section>
          {/if}
        </aside>
      {/if}
    </section>
  </main>

  <footer class="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8 2xl:max-w-384">
    <div class="panel-surface flex flex-col gap-3 rounded-4xl px-5 py-4 text-sm text-ocean-100/76 sm:flex-row sm:items-center sm:justify-between">
      <p>{copy.footer.summary}</p>
      <p>{copy.footer.poweredBy} <span class="font-semibold text-white">NPRPC</span></p>
    </div>
  </footer>

  <AssistantPanel
    sessionId={authState?.sessionId ?? null}
    uiText={copy.assistant}
    onSolutionChanged={() => {
      invalidateSolutionsCatalogCache();
      window.dispatchEvent(new CustomEvent("nscalc:solutions-changed"));
    }}
    onFertilizerChanged={() => {
      invalidateFertilizersCatalogCache();
      window.dispatchEvent(new CustomEvent("nscalc:fertilizers-changed"));
    }}
  />
</div>