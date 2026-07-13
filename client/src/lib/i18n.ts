export type Locale = "en" | "ru";

type JournalStageKey = "Planning" | "Germination" | "Vegetative" | "Flowering" | "Harvest" | "Archived";
type JournalVisibilityKey = "Private" | "Unlisted" | "Public";
type JournalUpdateKindKey = "Note" | "Measurement" | "PhotoSet" | "Video";
type JournalMediaKindKey = "Image" | "Video";
type JournalMediaStatusKey = "PendingUpload" | "Uploading" | "Queued" | "Processing" | "Ready" | "Failed";

export type JournalVideoPlayerCopy = {
  loading: string;
  failed: string;
  retry: string;
  meta: string;
  receivedSuffix: string;
};

export type JournalCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  summaryStories: string;
  summaryUpdates: string;
  summaryPendingUploads: string;
  searchStories: string;
  searchPlaceholder: string;
  stage: string;
  createEyebrow: string;
  createBody: string;
  createAction: string;
  creatingAction: string;
  title: string;
  titlePlaceholder: string;
  crop: string;
  cropPlaceholder: string;
  visibility: string;
  solutionId: string;
  optional: string;
  description: string;
  visibleStories: string;
  total: string;
  loadingStories: string;
  noStoriesMatch: string;
  noSolutionLinked: string;
  storyCardHint: string;
  storyModal: string;
  deleteStory: string;
  deletingStory: string;
  close: string;
  cover: string;
  openFullScreen: string;
  image: string;
  coverHelp: string;
  noCoverImage: string;
  liveWatch: string;
  liveWatchHelp: string;
  moderator: string;
  moderatorFallback: string;
  moderatorHelp: string;
  created: string;
  lastUpdate: string;
  timelineDepth: string;
  entries: string;
  loadingStoryTimeline: string;
  untitledUpdate: string;
  followUp: string;
  mediaOnlyEntry: string;
  tapPreview: string;
  openImage: string;
  adaptiveReady: string;
  playVideo: string;
  adaptivePending: string;
  uploadQueue: string;
  percentComplete: string;
  noUploadActivity: string;
  storyDirection: string;
  quickCompose: string;
  quickComposeHelp: string;
  dismissStoryHint: string;
  entryType: string;
  mixedMediaHint: string;
  autoSetHintPrefix: string;
  body: string;
  bodyPlaceholder: string;
  attachMedia: string;
  remove: string;
  posting: string;
  postSplitMediaUpdates: string;
  postUpdateAndUploadSuffix: string;
  postUpdateSuffix: string;
  storyMedia: string;
  imageViewer: string;
  previous: string;
  next: string;
  previousMediaAria: string;
  nextMediaAria: string;
  liveUpdatesOn: string;
  liveUpdatesConnecting: string;
  liveUpdatesUnavailable: string;
  liveUpdatesOff: string;
  storyCreated: string;
  updatePostedUploaded: string;
  updatePosted: string;
  updatePostedFailedUploads: string;
  mixedMediaSplitMessage: string;
  couldNotLoadStories: string;
  couldNotLoadStoryDetails: string;
  couldNotCreateStory: string;
  couldNotCreateUpdate: string;
  uploadFailed: string;
  uploadRetrying: string;
  confirmDeleteStory: string;
  deletedByModeratorSuffix: string;
  couldNotDeleteStory: string;
  latestUpdate: string;
  draftedFollowUpFor: string;
  followUpPrefix: string;
  followUpBodyPrefix: string;
  couldNotConnectLiveUpdates: string;
  liveUpdatesDisconnected: string;
  loggedFromJournal: string;
  labels: {
    allStages: string;
    stages: Record<JournalStageKey, string>;
    visibilities: Record<JournalVisibilityKey, string>;
    updateKinds: Record<JournalUpdateKindKey, string>;
    mediaKinds: Record<JournalMediaKindKey, string>;
    mediaStatuses: Record<JournalMediaStatusKey, string>;
    photo: string;
    photos: string;
    video: string;
  };
  videoPlayer: JournalVideoPlayerCopy;
};

export type SolutionCardCopy = {
  solutionIndex: (index: number) => string;
  byPrefix: string;
  liveTarget: string;
  editor: string;
  close: string;
  edit: string;
  delete: string;
  name: string;
  elements: string;
  save: string;
  saving: string;
  ratios: string;
};

export type SolutionsCopy = {
  heroEyebrow: string;
  heroTitle: string;
  loadedCount: (count: number) => string;
  moreAvailable: string;
  endOfResults: string;
  searchByName: string;
  searchPlaceholder: string;
  author: string;
  authorPlaceholder: string;
  createEyebrow: string;
  createBody: string;
  loginHint: string;
  hideForm: string;
  newSolution: string;
  createMessage: string;
  createName: string;
  createNamePlaceholder: string;
  elements: string;
  creating: string;
  createAction: string;
  loading: string;
  noMatches: string;
  loadingMore: string;
  loadMore: string;
  allLoaded: string;
  errors: {
    loginBeforeEdit: string;
    enterName: string;
    invalidElements: string;
    failedSave: string;
    ownOnlyEdit: string;
    loginBeforeDelete: string;
    ownOnlyDelete: string;
    failedDelete: string;
    loginBeforeCreate: string;
    failedCreate: string;
    failedLoad: string;
    failedLoadMore: string;
  };
  messages: {
    saving: string;
    saved: string;
    deleted: string;
    creating: string;
    created: string;
  };
  confirmDelete: (name: string) => string;
  card: SolutionCardCopy;
};

export type AssistantCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  promptPlaceholder: string;
  loginHint: string;
  ask: string;
  asking: string;
  hide: string;
  open: string;
  expand: string;
  exitFullscreen: string;
  clearChat: string;
  emptyChat: string;
  youLabel: string;
  assistantLabel: string;
  photoAttachedNote: string;
  toolCallLabel: (toolName: string) => string;
  solutionUpdatedLabel: (name: string) => string;
  fertilizerUpdatedLabel: (name: string) => string;
  attachPhoto: string;
  photoAttached: string;
  removePhoto: string;
  errors: {
    notLoggedIn: string;
    unavailable: string;
    failed: string;
    invalidImage: string;
  };
};

export type FertilizersCopy = {
  heroEyebrow: string;
  heroTitle: string;
  searchProducts: string;
  searchPlaceholder: string;
  loadedCount: (count: number) => string;
  moreAvailable: string;
  endOfResults: string;
  createEyebrow: string;
  createBody: string;
  loginHint: string;
  hideForm: string;
  newFertilizer: string;
  name: string;
  namePlaceholder: string;
  formula: string;
  formulaPlaceholder: string;
  creating: string;
  createAction: string;
  loading: string;
  noMatches: string;
  productCard: string;
  byPrefix: string;
  noFormulaSaved: string;
  formulaEditor: string;
  close: string;
  editFormula: string;
  delete: string;
  backendParsedFormula: string;
  verify: string;
  verifying: string;
  reset: string;
  loadingMore: string;
  loadMore: string;
  allLoaded: string;
  bottleLabels: {
    A: string;
    B: string;
    C: string;
  };
  errors: {
    loginBeforeEdit: string;
    enterFormula: string;
    ownOnlyEdit: string;
    failedVerify: string;
    loginBeforeDelete: string;
    ownOnlyDelete: string;
    failedDelete: string;
    loginBeforeCreate: string;
    enterName: string;
    enterFormulaCreate: string;
    failedCreate: string;
    failedLoad: string;
    failedLoadMore: string;
  };
  messages: {
    verifying: string;
    verified: string;
    deleted: string;
    creating: string;
    created: string;
  };
  confirmDelete: (name: string) => string;
};

export type CalculatorCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  summaryTargetNh4: string;
  summaryMixNh4: string;
  summaryMixEc: string;
  summaryResidual: string;
  calculations: string;
  calculationName: string;
  calculationNamePlaceholder: string;
  savedCalculations: string;
  unsavedDraft: string;
  guestDraft: string;
  newAction: string;
  saveAction: string;
  savingAction: string;
  deleteAction: string;
  deletingAction: string;
  loadingCalculations: string;
  guestReadonlyHint: string;
  targetRecipe: string;
  searchSolutions: string;
  searchSolutionsPlaceholder: string;
  solutionPreset: string;
  loadingSolutions: string;
  noSolutionsFound: string;
  customTarget: string;
  searchMode: string;
  defaultsMode: string;
  searching: string;
  loadingMoreSolutions: string;
  loadMoreSolutionMatches: string;
  noMoreSolutionMatches: string;
  tankVolume: string;
  ppmSuffix: string;
  secondaryMicronutrients: string;
  fertilizers: string;
  fertilizersBody: string;
  inputsActive: (count: number) => string;
  savePdf: string;
  savingPdf: string;
  autoSolve: string;
  searchFertilizers: string;
  searchFertilizersPlaceholder: string;
  searchResults: string;
  noFertilizersMatch: string;
  selected: string;
  engineMode: string;
  manualMode: string;
  gramsPerLiter: string;
  unselect: string;
  tankMass: string;
  cost: string;
  massUnit: string;
  loadingMoreFertilizers: string;
  loadMoreFertilizerMatches: string;
  noMoreFertilizerMatches: string;
  targetVsMix: string;
  targetVsMixBody: string;
  targetEcLabel: string;
  mixEcLabel: string;
  nkLabel: string;
  element: string;
  target: string;
  mix: string;
  delta: string;
  totalTarget: string;
  totalMixed: string;
  solutionMatrix: string;
  solutionMatrixBody: string;
  editMass: string;
  emptyMatrix: string;
  fertilizerColumn: string;
  massColumn: string;
  modeLabels: {
    auto: string;
    manual: string;
  };
  bottleLabels: {
    A: string;
    B: string;
    C: string;
  };
  messages: {
    pickFertilizers: string;
    draftReady: string;
    guestDraftReadonly: string;
    savedRestored: string;
    calculationLoaded: string;
    noSaved: string;
    noGuest: string;
    signInSave: string;
    saved: string;
    signInDelete: string;
    selectSavedToDelete: string;
    deleted: string;
    manualTweak: string;
    loadTargetBeforeSolve: string;
    pdfDownloaded: string;
    catalogLoadFailed: string;
  };
  loadedSavedCalculations: (count: number) => string;
  loadedGuestCalculations: (count: number) => string;
  loadedCalculation: (name: string) => string;
  engineSolved: (count: number, residual: number) => string;
  fallbackNames: {
    defaultCalculation: string;
    savedCalculation: string;
    customCalculation: string;
    customCalculationFile: string;
  };
  errors: {
    failedLoadCalculations: string;
    failedSaveCalculation: string;
    failedDeleteCalculation: string;
    exportRequiresTarget: string;
    failedExportPdf: string;
    failedBootstrap: string;
    failedSearchSolutions: string;
    failedSearchFertilizers: string;
  };
};

export type AppCopy = {
  auth: {
    enterCredentials: string;
    loginFailedPrefix: string;
    noAccountForEmail: string;
    incorrectPassword: string;
    unknownError: string;
    loginFailed: string;
    logoutFailed: string;
  };
  chat: {
    eyebrow: string;
    title: string;
    body: string;
    outgoingMessage: string;
    incomingMessage: string;
    placeholder: string;
    send: string;
  };
  priorities: {
    title: string;
    items: string[];
  };
  snapshot: {
    titleSuffix: string;
    labels: {
      account: string;
      journalMode: string;
      sharedEvent: string;
      eventDraft: string;
      libraryAccess: string;
      primaryUse: string;
      workflow: string;
      catalogAccess: string;
      status: string;
      context: string;
      nextStep: string;
      currentView: string;
      experience: string;
    };
    values: {
      guest: string;
      admin: string;
      signedIn: string;
      loading: string;
      liveNow: string;
      scheduled: string;
      inactive: string;
      moderation: string;
      reader: string;
      unsaved: string;
      synced: string;
      personalShared: string;
      sharedOnly: string;
      targetRecipes: string;
      elementRatios: string;
      editable: string;
      readOnly: string;
      planned: string;
      realtimeSync: string;
      mobileFirst: string;
    };
    details: {
      journalAdminAccount: string;
      journalSignedInAccount: string;
      journalGuestAccount: string;
      journalModerationMode: string;
      journalReaderMode: string;
      sharedEventRefreshing: string;
      eventDraftStaged: string;
      eventDraftSynced: string;
      eventDraftReadonly: string;
      solutionsAccountSignedIn: string;
      solutionsAccountGuest: string;
      solutionsLibrarySignedIn: string;
      solutionsLibraryGuest: string;
      solutionsPrimaryUse: string;
      solutionsWorkflowSignedIn: string;
      solutionsWorkflowGuest: string;
      fertilizersAccountSignedIn: string;
      fertilizersAccountGuest: string;
      fertilizersCatalogSignedIn: string;
      fertilizersCatalogGuest: string;
      fertilizersPrimaryUse: string;
      fertilizersWorkflowSignedIn: string;
      fertilizersWorkflowGuest: string;
      chatAccountSignedIn: string;
      chatAccountGuest: string;
      chatStatus: string;
      chatContextAdmin: string;
      chatContextUser: string;
      chatNextStep: string;
      aboutAccountAdmin: string;
      aboutAccountSignedIn: string;
      aboutAccountGuest: string;
      aboutExperience: string;
      sharedEventStateRefreshing: string;
    };
  };
  event: {
    seasonalEvent: string;
    isLiveNow: string;
    isArmed: string;
    hideEventPanel: string;
    manageEvent: string;
    adminEyebrow: string;
    adminTitle: string;
    adminBody: string;
    collapse: string;
    expand: string;
    runtime: string;
    schedule: string;
    runtimeLive: string;
    runtimeIdle: string;
    scheduleActive: string;
    scheduleArmed: string;
    scheduleOff: string;
    sharedServerEvent: string;
    loadingFromServer: string;
    lastUpdate: (updatedAt: string, updatedBy: string | null) => string;
    notYetSaved: string;
    variant: string;
    variants: {
      fireworks: string;
      snow: string;
      petals: string;
    };
    descriptions: {
      fireworks: string;
      snow: string;
      petals: string;
    };
    enableSharedEvent: string;
    enableSharedEventHelp: string;
    autoplay: string;
    autoplayHelp: string;
    starts: string;
    ends: string;
    duration: string;
    durationOptions: {
      ten: string;
      eighteen: string;
      twentyFour: string;
      thirty: string;
    };
    intensity: string;
    intensities: {
      gentle: string;
      showtime: string;
    };
    previewVariant: (variant: string) => string;
    stopPreview: string;
    clearSchedule: string;
    resetDraft: string;
    saveSharedEvent: string;
    savingSharedEvent: string;
    clearScheduleMessage: string;
    resetDraftMessage: string;
    stopPreviewMessage: string;
    eventStoppedMessage: string;
    alreadyRunning: string;
    loadingPreview: string;
    loadingSeasonal: string;
    previewFinished: string;
    completed: (variant: string) => string;
    previewLive: (variant: string) => string;
    triggered: (variant: string) => string;
    unableToStart: string;
    unableLoad: string;
    adminRequiredSave: string;
    savingSharedConfig: string;
    savedForVisitors: (variant: string) => string;
    adminExpired: string;
    unableSave: string;
    windowRange: (start: string, end: string) => string;
    windowStarts: (start: string) => string;
    windowEnds: (end: string) => string;
    windowAutoplay: string;
  };
};

export type TranslationSet = {
  headTitle: string;
  shell: {
    brandEyebrow: string;
    heroTitle: string;
    heroBody: string;
    email: string;
    password: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    working: string;
    refreshLogin: string;
    logIn: string;
    logOut: string;
    register: string;
    signedInAs: string;
    moderatorEnabled: string;
    language: string;
    currentView: string;
    openMenu: string;
    closeMenu: string;
  };
  nav: {
    journal: { label: string; blurb: string };
    calculator: { label: string; blurb: string };
    solutions: { label: string; blurb: string };
    fertilizers: { label: string; blurb: string };
    chat: { label: string; blurb: string };
    about: { label: string; blurb: string };
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    aside: string;
  };
  footer: {
    summary: string;
    poweredBy: string;
  };
  app: AppCopy;
  journal: JournalCopy;
  calculator: CalculatorCopy;
  solutions: SolutionsCopy;
  fertilizers: FertilizersCopy;
  assistant: AssistantCopy;
};

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export const translations: Record<Locale, TranslationSet> = {
  en: {
    headTitle: "NScalc Grow Journal",
    shell: {
      brandEyebrow: "NScalc",
      heroTitle: "A grow journal with nutrient context built in.",
      heroBody: "Keep crop history, solution targets, and fertilizer references close together so daily decisions are easier to review on a phone or at a desk.",
      email: "Email",
      password: "Password",
      emailPlaceholder: "grower@example.com",
      passwordPlaceholder: "••••••••",
      working: "Working...",
      refreshLogin: "Refresh login",
      logIn: "Log in",
      logOut: "Log out",
      register: "Register",
      signedInAs: "Signed in as",
      moderatorEnabled: "moderator controls enabled",
      language: "Language",
      currentView: "Current view",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    nav: {
      journal: { label: "Journal", blurb: "Track each crop as one continuous timeline." },
      calculator: { label: "Calculator", blurb: "Mix recipes quickly on touch screens." },
      solutions: { label: "Solutions", blurb: "Save reusable nutrient targets." },
      fertilizers: { label: "Fertilizers", blurb: "Check products and element ratios." },
      chat: { label: "Chat", blurb: "Reserved for future team collaboration." },
      about: { label: "About", blurb: "See how the journal and nutrient tools fit together." },
    },
    about: {
      eyebrow: "About nscalc",
      title: "Built for growers who need notes, recipes, and references in one place.",
      body: "The journal, calculator, solution targets, and fertilizer library are meant to work as one daily workflow whether you are checking a reservoir on a phone or planning changes at a desk.",
      aside: "This interface focuses on fast mobile reading, clear forms, and keeping crop history close to the nutrient context that explains it.",
    },
    footer: {
      summary: "Crop history, nutrient planning, and shared references in one mobile-first workspace.",
      poweredBy: "Powered by",
    },
    app: {
      auth: {
        enterCredentials: "Enter an email and password.",
        loginFailedPrefix: "Login failed:",
        noAccountForEmail: "No account found with that email.",
        incorrectPassword: "Incorrect password.",
        unknownError: "Unknown error.",
        loginFailed: "Login failed.",
        logoutFailed: "Logout failed.",
      },
      chat: {
        eyebrow: "Realtime shell",
        title: "Chat should feel like messaging, not a spreadsheet sidebar.",
        body: "A phone-friendly chat view wants a message list, composer pinned to the bottom, and strong separation between collaboration and calculation tools.",
        outgoingMessage: "Stream-based chat is wired on the server, but the new client can use a proper mobile conversation layout.",
        incomingMessage: "Keep the composer sticky, support attachment chips, and treat presence separately from the feed.",
        placeholder: "Type a message",
        send: "Send",
      },
      priorities: {
        title: "Mobile priorities",
        items: [
          "Keep story context visible while uploads continue in the background.",
          "Collapse dense control groups into stacked sections.",
          "Avoid desktop-only hover affordances for core actions.",
        ],
      },
      snapshot: {
        titleSuffix: "snapshot",
        labels: {
          account: "Account",
          journalMode: "Journal mode",
          sharedEvent: "Shared event",
          eventDraft: "Event draft",
          libraryAccess: "Library access",
          primaryUse: "Primary use",
          workflow: "Workflow",
          catalogAccess: "Catalog access",
          status: "Status",
          context: "Context",
          nextStep: "Next step",
          currentView: "Current view",
          experience: "Experience",
        },
        values: {
          guest: "Guest",
          admin: "Admin",
          signedIn: "Signed in",
          loading: "Loading",
          liveNow: "Live now",
          scheduled: "Scheduled",
          inactive: "Inactive",
          moderation: "Moderation",
          reader: "Reader",
          unsaved: "Unsaved",
          synced: "Synced",
          personalShared: "Personal + shared",
          sharedOnly: "Shared only",
          targetRecipes: "Target recipes",
          elementRatios: "Element ratios",
          editable: "Editable",
          readOnly: "Read-only",
          planned: "Planned",
          realtimeSync: "Realtime sync",
          mobileFirst: "Mobile-first",
        },
        details: {
          journalAdminAccount: "Moderator tools available in the journal.",
          journalSignedInAccount: "Story actions use your signed-in account.",
          journalGuestAccount: "Browsing stories without account-specific tools.",
          journalModerationMode: "You can manage the shared event panel and journal moderation flows.",
          journalReaderMode: "Stories, uploads, and fullscreen media stay optimized for mobile review.",
          sharedEventRefreshing: "Refreshing the shared overlay state from the server.",
          eventDraftStaged: "Admin changes are staged locally until you save them.",
          eventDraftSynced: "Server config and local draft are aligned.",
          eventDraftReadonly: "Only admins can edit the shared event configuration.",
          solutionsAccountSignedIn: "Your solution list can include personal and shared targets.",
          solutionsAccountGuest: "Guest mode can inspect the shared solution library.",
          solutionsLibrarySignedIn: "Save, update, and delete your own nutrient targets.",
          solutionsLibraryGuest: "Sign in to create or maintain a personal solution library.",
          solutionsPrimaryUse: "Reusable nutrient profiles feed the calculator and journal workflows.",
          solutionsWorkflowSignedIn: "Use this space to curate mixes you return to often.",
          solutionsWorkflowGuest: "Browse targets now, then sign in if you want to keep your own set.",
          fertilizersAccountSignedIn: "Your fertilizer list can combine personal and shared products.",
          fertilizersAccountGuest: "Guest mode can inspect the shared fertilizer catalog.",
          fertilizersCatalogSignedIn: "Save the products you actually stock and keep their analyses current.",
          fertilizersCatalogGuest: "Sign in to maintain a personal fertilizer catalog.",
          fertilizersPrimaryUse: "Product analyses here feed the calculator matrix and solver.",
          fertilizersWorkflowSignedIn: "Adjust personal entries without affecting the shared reference list.",
          fertilizersWorkflowGuest: "Browse the reference list now, then sign in to save your own products.",
          chatAccountSignedIn: "A signed-in session is already available for future collaboration features.",
          chatAccountGuest: "Guest browsing is active until realtime chat lands.",
          chatStatus: "This area is reserved for realtime collaboration rather than static notes.",
          chatContextAdmin: "Admin context can later cover support and moderation workflows.",
          chatContextUser: "User identity is ready to flow into future chat sessions.",
          chatNextStep: "The useful outcome here is shared crop discussion, not another static info page.",
          aboutAccountAdmin: "Admin tools are enabled for shared event configuration.",
          aboutAccountSignedIn: "Signed-in flows are active across the app.",
          aboutAccountGuest: "Guest mode still exposes shared data and guest calculations.",
          aboutExperience: "The shell prioritizes readable touch workflows for journal, calculator, and libraries.",
          sharedEventStateRefreshing: "Refreshing event state from the server.",
        },
      },
      event: {
        seasonalEvent: "Seasonal event",
        isLiveNow: "is live now",
        isArmed: "is armed",
        hideEventPanel: "Hide event panel",
        manageEvent: "Manage event",
        adminEyebrow: "Admin event panel",
        adminTitle: "Seasonal runtime controls",
        adminBody: "This panel keeps the shared schedule on the server and loads the visual effect code only when a live event or preview actually starts.",
        collapse: "Collapse",
        expand: "Expand",
        runtime: "Runtime",
        schedule: "Schedule",
        runtimeLive: "Live",
        runtimeIdle: "Idle",
        scheduleActive: "Active",
        scheduleArmed: "Armed",
        scheduleOff: "Off",
        sharedServerEvent: "Shared server event",
        loadingFromServer: "Loading from server...",
        lastUpdate: (updatedAt, updatedBy) => `Last update ${updatedAt}${updatedBy ? ` by ${updatedBy}` : ""}.`,
        notYetSaved: "not yet saved",
        variant: "Variant",
        variants: {
          fireworks: "New Year fireworks",
          snow: "Winter snowfall",
          petals: "Spring blossom",
        },
        descriptions: {
          fireworks: "A short celebratory burst of fireworks when the page opens.",
          snow: "Slow drifting snow with a light atmospheric overlay.",
          petals: "Soft sakura petals drifting down - a gentle spring welcome.",
        },
        enableSharedEvent: "Enable shared event",
        enableSharedEventHelp: "Keeps the event armed for the configured window.",
        autoplay: "Autoplay when users open the site",
        autoplayHelp: "If no window is set, this will run on every fresh visit in this browser.",
        starts: "Starts",
        ends: "Ends",
        duration: "Duration",
        durationOptions: {
          ten: "10 seconds",
          eighteen: "18 seconds",
          twentyFour: "24 seconds",
          thirty: "30 seconds",
        },
        intensity: "Intensity",
        intensities: {
          gentle: "Gentle",
          showtime: "Showtime",
        },
        previewVariant: (variant) => `Preview ${variant}`,
        stopPreview: "Stop preview",
        clearSchedule: "Clear schedule",
        resetDraft: "Reset draft",
        saveSharedEvent: "Save shared event",
        savingSharedEvent: "Saving...",
        clearScheduleMessage: "Schedule window cleared.",
        resetDraftMessage: "Draft reset to server config.",
        stopPreviewMessage: "Preview stopped.",
        eventStoppedMessage: "Event stopped.",
        alreadyRunning: "An event preview is already running.",
        loadingPreview: "Loading event preview...",
        loadingSeasonal: "Loading seasonal event...",
        previewFinished: "Preview finished.",
        completed: (variant) => `${variant} completed.`,
        previewLive: (variant) => `${variant} preview is live.`,
        triggered: (variant) => `${variant} triggered.`,
        unableToStart: "Unable to start event effect.",
        unableLoad: "Unable to load site event config.",
        adminRequiredSave: "Log in as an admin to save event changes.",
        savingSharedConfig: "Saving shared event config...",
        savedForVisitors: (variant) => `Saved ${variant} for all visitors.`,
        adminExpired: "Your admin session expired. Log in again and retry.",
        unableSave: "Unable to save site event config.",
        windowRange: (start, end) => `Runs ${start} to ${end}`,
        windowStarts: (start) => `Starts ${start}`,
        windowEnds: (end) => `Runs until ${end}`,
        windowAutoplay: "Runs whenever autoplay is enabled.",
      },
    },
    calculator: {
      heroEyebrow: "Calculator cockpit",
      heroTitle: "Build a recipe from target solution numbers instead of juggling notes by hand.",
      heroBody: "Start from saved solution targets, pull fertilizers from the library, and compare the mixed result against the target before you export a recipe sheet.",
      summaryTargetNh4: "Target NH4 %",
      summaryMixNh4: "Mix NH4 %",
      summaryMixEc: "Mix EC",
      summaryResidual: "Residual",
      calculations: "Calculations",
      calculationName: "Calculation name",
      calculationNamePlaceholder: "New calculation",
      savedCalculations: "Saved calculations",
      unsavedDraft: "Unsaved draft",
      guestDraft: "Guest calculation or draft",
      newAction: "New",
      saveAction: "Save",
      savingAction: "Saving...",
      deleteAction: "Delete",
      deletingAction: "Deleting...",
      loadingCalculations: "Loading calculations...",
      guestReadonlyHint: "Guest calculations are loaded from the server. Sign in to save or delete your own calculations.",
      targetRecipe: "Target recipe",
      searchSolutions: "Search solutions",
      searchSolutionsPlaceholder: "Tomato, basil, cucumber...",
      solutionPreset: "Solution preset",
      loadingSolutions: "Loading solutions...",
      noSolutionsFound: "No solutions found",
      customTarget: "Custom target",
      searchMode: "Search mode",
      defaultsMode: "Most-used defaults",
      searching: "Searching...",
      loadingMoreSolutions: "Loading more solutions...",
      loadMoreSolutionMatches: "Load more solution matches",
      noMoreSolutionMatches: "No more solution matches",
      tankVolume: "Tank volume",
      ppmSuffix: "ppm",
      secondaryMicronutrients: "Secondary + micronutrients",
      fertilizers: "Fertilizers",
      fertilizersBody: "Search the library, select products, and adjust active doses from the same list.",
      inputsActive: (count) => `${count} inputs active`,
      savePdf: "Save PDF",
      savingPdf: "Saving PDF...",
      autoSolve: "Auto-solve doses",
      searchFertilizers: "Search fertilizers",
      searchFertilizersPlaceholder: "Calcium, sulfate, blend...",
      searchResults: "Search results",
      noFertilizersMatch: "No fertilizers match the current query.",
      selected: "Selected",
      engineMode: "engine",
      manualMode: "manual",
      gramsPerLiter: "g / L",
      unselect: "Unselect",
      tankMass: "Tank mass",
      cost: "Cost",
      massUnit: "g",
      loadingMoreFertilizers: "Loading more fertilizers...",
      loadMoreFertilizerMatches: "Load more fertilizer matches",
      noMoreFertilizerMatches: "No more fertilizer matches",
      targetVsMix: "Target vs mix",
      targetVsMixBody: "Use the client-side solver against solution and fertilizer data, then inspect the nutrient deltas before you commit the recipe.",
      targetEcLabel: "Target EC",
      mixEcLabel: "Mix EC",
      nkLabel: "N:K",
      element: "Element",
      target: "Target",
      mix: "Mix",
      delta: "Delta",
      totalTarget: "Total target",
      totalMixed: "Total mixed",
      solutionMatrix: "Solution matrix",
      solutionMatrixBody: "Inspect how each selected fertilizer contributes to each nutrient and optionally tweak total grams directly.",
      editMass: "Edit mass",
      emptyMatrix: "Solve or select fertilizers to populate the solution matrix.",
      fertilizerColumn: "Fertilizer",
      massColumn: "Mass (g.)",
      modeLabels: { auto: "auto", manual: "manual" },
      bottleLabels: { A: "Tank A", B: "Tank B", C: "Tank C" },
      messages: {
        pickFertilizers: "Pick fertilizers to let the engine solve the dose set.",
        draftReady: "New calculation draft ready.",
        guestDraftReadonly: "Guest calculations are read-only. Sign in to save your own draft.",
        savedRestored: "Saved calculation restored. Doses were recomputed from the stored fertilizer set.",
        calculationLoaded: "Calculation loaded. Pick fertilizers to solve a new recipe.",
        noSaved: "No saved calculations yet.",
        noGuest: "No guest calculations are available.",
        signInSave: "Sign in to save calculations.",
        saved: "Calculation saved.",
        signInDelete: "Sign in to delete saved calculations.",
        selectSavedToDelete: "Select a saved calculation to delete.",
        deleted: "Calculation deleted.",
        manualTweak: "Manual tweak mode. Use Auto-solve doses to return to the engine output.",
        loadTargetBeforeSolve: "Load a solution target before solving doses.",
        pdfDownloaded: "PDF report downloaded.",
        catalogLoadFailed: "Calculator catalog data could not be loaded from the server.",
      },
      loadedSavedCalculations: (count) => `Loaded ${count} saved calculation${count === 1 ? "" : "s"}.`,
      loadedGuestCalculations: (count) => `Loaded ${count} guest calculation${count === 1 ? "" : "s"}.`,
      loadedCalculation: (name) => `Loaded ${name}.`,
      engineSolved: (count, residual) => `Engine solved ${count} fertilizer inputs with residual ${residual.toFixed(1)}.`,
      fallbackNames: {
        defaultCalculation: "New Calculation",
        savedCalculation: "Saved calculation",
        customCalculation: "Custom calculation",
        customCalculationFile: "custom-calculation",
      },
      errors: {
        failedLoadCalculations: "Failed to load calculations.",
        failedSaveCalculation: "Failed to save calculation.",
        failedDeleteCalculation: "Failed to delete calculation.",
        exportRequiresTarget: "Pick a target and at least one fertilizer before exporting a PDF.",
        failedExportPdf: "Failed to generate PDF report.",
        failedBootstrap: "Failed to load calculator bootstrap data.",
        failedSearchSolutions: "Failed to search solutions.",
        failedSearchFertilizers: "Failed to search fertilizers.",
      },
    },
    solutions: {
      heroEyebrow: "Solution library",
      heroTitle: "Keep reusable target recipes close to the journal and calculator.",
      loadedCount: (count) => `${count} loaded`,
      moreAvailable: "More available",
      endOfResults: "End of results",
      searchByName: "Search by name",
      searchPlaceholder: "Calcium, cucumber, bloom...",
      author: "Author",
      authorPlaceholder: "superuser, guest...",
      createEyebrow: "Create solution",
      createBody: "Build a new solution card directly from the shelf and save it to the server.",
      loginHint: "Log in to create or edit your own solutions.",
      hideForm: "Hide form",
      newSolution: "New solution",
      createMessage: "Create solution",
      createName: "Solution name",
      createNamePlaceholder: "Bloom target week 3",
      elements: "Elements",
      creating: "Creating...",
      createAction: "Create solution",
      loading: "Loading solutions from the catalog...",
      noMatches: "No solutions match the current filters.",
      loadingMore: "Loading more...",
      loadMore: "Load more solutions",
      allLoaded: "All solutions loaded",
      errors: {
        loginBeforeEdit: "Log in again before editing solutions.",
        enterName: "Enter a solution name.",
        invalidElements: "Invalid solution elements.",
        failedSave: "Failed to save solution.",
        ownOnlyEdit: "You can only edit your own solutions.",
        loginBeforeDelete: "Log in again before deleting solutions.",
        ownOnlyDelete: "You can only delete your own solutions.",
        failedDelete: "Failed to delete solution.",
        loginBeforeCreate: "Log in before creating solutions.",
        failedCreate: "Failed to create solution.",
        failedLoad: "Failed to load solutions.",
        failedLoadMore: "Failed to load more solutions.",
      },
      messages: {
        saving: "Saving solution...",
        saved: "Solution saved.",
        deleted: "Solution deleted.",
        creating: "Creating solution...",
        created: "Solution created.",
      },
      confirmDelete: (name) => `Delete solution "${name}"?`,
      card: {
        solutionIndex: (index) => `Solution #${index}`,
        byPrefix: "by",
        liveTarget: "Live target",
        editor: "Solution editor",
        close: "Close",
        edit: "Edit solution",
        delete: "Delete",
        name: "Name",
        elements: "Elements",
        save: "Save solution",
        saving: "Saving...",
        ratios: "Ratios",
      },
    },
    assistant: {
      heroEyebrow: "AI assistant",
      heroTitle: "Describe a crop, get a target solution.",
      heroBody: "Tell it what you're growing (or attach a photo of a fertilizer label) and it will propose and save a solution or fertilizer for you.",
      promptPlaceholder: "I'm growing lettuce in vegetative stage...",
      loginHint: "Log in to ask the assistant to create or update solutions for you.",
      ask: "Ask assistant",
      asking: "Thinking...",
      hide: "Hide",
      open: "Open AI assistant",
      expand: "Full screen",
      exitFullscreen: "Exit full screen",
      clearChat: "Clear chat",
      emptyChat: "Ask anything about crops, solutions, or fertilizer labels — this chat stays in this browser.",
      youLabel: "You",
      assistantLabel: "Assistant",
      photoAttachedNote: "Photo attached",
      toolCallLabel: (toolName) => `Working: ${toolName}...`,
      solutionUpdatedLabel: (name) => `Updated solution: ${name}`,
      fertilizerUpdatedLabel: (name) => `Updated fertilizer: ${name}`,
      attachPhoto: "Attach a fertilizer photo",
      photoAttached: "Photo attached",
      removePhoto: "Remove",
      errors: {
        notLoggedIn: "Log in before asking the assistant.",
        unavailable: "The AI assistant is unavailable right now.",
        failed: "Something went wrong asking the assistant.",
        invalidImage: "Couldn't read that image — try a different photo.",
      },
    },
    fertilizers: {
      heroEyebrow: "Fertilizer shelf",
      heroTitle: "Keep product cards readable on a phone and dense enough for a desktop catalog.",
      searchProducts: "Search products",
      searchPlaceholder: "Magnesium, sulfate, nitrate...",
      loadedCount: (count) => `${count} loaded`,
      moreAvailable: "More available",
      endOfResults: "End of results",
      createEyebrow: "Create fertilizer",
      createBody: "Add a new product by name and let the server formula parser populate the card.",
      loginHint: "Log in to create or edit your own fertilizers.",
      hideForm: "Hide form",
      newFertilizer: "New fertilizer",
      name: "Fertilizer name",
      namePlaceholder: "Calcium nitrate stock",
      formula: "Formula",
      formulaPlaceholder: "bottle := A; formula Ca(NO3)2 * 4H2O purity 99.8;",
      creating: "Creating...",
      createAction: "Create fertilizer",
      loading: "Loading fertilizers from the catalog...",
      noMatches: "No fertilizers match the current search.",
      productCard: "Product card",
      byPrefix: "by",
      noFormulaSaved: "No formula saved.",
      formulaEditor: "Formula editor",
      close: "Close",
      editFormula: "Edit formula",
      delete: "Delete",
      backendParsedFormula: "Server parsed formula",
      verify: "Verify",
      verifying: "Verifying...",
      reset: "Reset",
      loadingMore: "Loading more...",
      loadMore: "Load more fertilizers",
      allLoaded: "All fertilizers loaded",
      bottleLabels: { A: "Tank A", B: "Tank B", C: "Tank C" },
      errors: {
        loginBeforeEdit: "Log in again before editing fertilizers.",
        enterFormula: "Enter a formula before verifying.",
        ownOnlyEdit: "You can only edit your own fertilizers.",
        failedVerify: "Failed to verify fertilizer formula.",
        loginBeforeDelete: "Log in again before deleting fertilizers.",
        ownOnlyDelete: "You can only delete your own fertilizers.",
        failedDelete: "Failed to delete fertilizer.",
        loginBeforeCreate: "Log in before creating fertilizers.",
        enterName: "Enter a fertilizer name.",
        enterFormulaCreate: "Enter a formula before creating the fertilizer.",
        failedCreate: "Failed to create fertilizer.",
        failedLoad: "Failed to load fertilizers.",
        failedLoadMore: "Failed to load more fertilizers.",
      },
      messages: {
        verifying: "Verifying with server parser...",
        verified: "Verified. Parsed elements refreshed from server.",
        deleted: "Fertilizer deleted.",
        creating: "Creating fertilizer...",
        created: "Fertilizer created.",
      },
      confirmDelete: (name) => `Delete fertilizer "${name}"?`,
    },
    journal: {
      heroEyebrow: "Grow journal",
      heroTitle: "Keep each crop in one timeline, from first transplant to final harvest.",
      heroBody: "Use stories to track decisions, measurements, photos, and video in the same place so you can review what changed and why.",
      summaryStories: "Stories",
      summaryUpdates: "Updates",
      summaryPendingUploads: "Pending uploads",
      searchStories: "Search stories",
      searchPlaceholder: "Basil, tomato, reservoir...",
      stage: "Stage",
      createEyebrow: "Create story",
      createBody: "Start a grow log for a bed, bench, reservoir, or trial batch, then add updates as the crop changes.",
      createAction: "Create story",
      creatingAction: "Creating...",
      title: "Title",
      titlePlaceholder: "Reservoir reset week 1",
      crop: "Crop",
      cropPlaceholder: "Tomato, basil, lettuce...",
      visibility: "Visibility",
      solutionId: "Solution ID",
      optional: "Optional",
      description: "Description",
      visibleStories: "visible stories",
      total: "total",
      loadingStories: "Loading stories...",
      noStoriesMatch: "No stories match the current filter.",
      noSolutionLinked: "No solution linked",
      storyCardHint: "Tap any story card to open it in a focused view while keeping the main feed compact.",
      storyModal: "Story modal",
      deleteStory: "Delete story",
      deletingStory: "Deleting...",
      close: "Close",
      cover: "Cover",
      openFullScreen: "Open full screen",
      image: "Image",
      coverHelp: "The cover updates from attached image assets and video posters.",
      noCoverImage: "No cover image yet. Add a photo or video and it will appear here.",
      liveWatch: "Live watch",
      liveWatchHelp: "New updates, upload progress, and attached media appear here without a manual reload.",
      moderator: "Moderator",
      moderatorFallback: "Moderator",
      moderatorHelp: "Delete removes the story, its timeline entries, and journal media metadata. Published files are cleaned up on the server.",
      created: "Created",
      lastUpdate: "Last update",
      timelineDepth: "Timeline depth",
      entries: "entries",
      loadingStoryTimeline: "Loading story timeline...",
      untitledUpdate: "Untitled update",
      followUp: "Follow up",
      mediaOnlyEntry: "Media-only entry.",
      tapPreview: "Tap the preview to inspect the full image without leaving the story timeline.",
      openImage: "Open image",
      adaptiveReady: "Adaptive playback is ready.",
      playVideo: "Play video",
      adaptivePending: "Adaptive playback will appear here once video processing finishes.",
      uploadQueue: "Upload queue",
      percentComplete: "complete",
      noUploadActivity: "No upload activity yet. Add files in the composer below and they will attach to this story as they finish uploading.",
      storyDirection: "Story direction",
      quickCompose: "Quick compose",
      quickComposeHelp: "Posting creates the update first, then any selected images or videos upload and attach to that entry. Text is optional when media is included.",
      dismissStoryHint: "Click outside, press Esc, or use Close to dismiss the story.",
      entryType: "Entry type",
      mixedMediaHint: "Mixed media will be split into separate photo and video updates.",
      autoSetHintPrefix: "Auto-set to",
      body: "Body",
      bodyPlaceholder: "Optional if you are only attaching media.",
      attachMedia: "Attach media",
      remove: "Remove",
      posting: "Posting...",
      postSplitMediaUpdates: "Post split media updates",
      postUpdateAndUploadSuffix: "update and upload media",
      postUpdateSuffix: "update",
      storyMedia: "Story media",
      imageViewer: "Image viewer",
      previous: "Prev",
      next: "Next",
      previousMediaAria: "Previous media",
      nextMediaAria: "Next media",
      liveUpdatesOn: "Live updates on",
      liveUpdatesConnecting: "Connecting live updates",
      liveUpdatesUnavailable: "Live updates unavailable",
      liveUpdatesOff: "Live updates off",
      storyCreated: "Story created.",
      updatePostedUploaded: "Update posted and media uploaded.",
      updatePosted: "Update posted.",
      updatePostedFailedUploads: "Update posted, but one or more uploads failed.",
      mixedMediaSplitMessage: "Mixed media split into separate photo and video updates.",
      couldNotLoadStories: "Could not load journal stories.",
      couldNotLoadStoryDetails: "Could not load story details.",
      couldNotCreateStory: "Could not create the story.",
      couldNotCreateUpdate: "Could not create the update.",
      uploadFailed: "upload failed",
      uploadRetrying: "Upload interrupted. Retrying",
      confirmDeleteStory: "Delete story",
      deletedByModeratorSuffix: "was deleted by",
      couldNotDeleteStory: "Could not delete the story.",
      latestUpdate: "latest update",
      draftedFollowUpFor: "Drafted a follow-up note for",
      followUpPrefix: "Follow-up:",
      followUpBodyPrefix: "Follow-up to:",
      couldNotConnectLiveUpdates: "Could not connect live story updates.",
      liveUpdatesDisconnected: "Live story updates disconnected.",
      loggedFromJournal: "Logged from the grow journal.",
      labels: {
        allStages: "All stages",
        stages: {
          Planning: "Planning",
          Germination: "Germination",
          Vegetative: "Vegetative",
          Flowering: "Flowering",
          Harvest: "Harvest",
          Archived: "Archived",
        },
        visibilities: {
          Private: "Private",
          Unlisted: "Unlisted",
          Public: "Public",
        },
        updateKinds: {
          Note: "Note",
          Measurement: "Measurement",
          PhotoSet: "Photo set",
          Video: "Video",
        },
        mediaKinds: {
          Image: "Image",
          Video: "Video",
        },
        mediaStatuses: {
          PendingUpload: "Pending upload",
          Uploading: "Uploading",
          Queued: "Queued",
          Processing: "Processing",
          Ready: "Ready",
          Failed: "Failed",
        },
        photo: "photo",
        photos: "Photos",
        video: "video",
      },
      videoPlayer: {
        loading: "Loading video...",
        failed: "Playback failed",
        retry: "Retry video",
        meta: "Adaptive video playback",
        receivedSuffix: "received",
      },
    },
  },
  ru: {
    headTitle: "NScalc Журнал выращивания",
    shell: {
      brandEyebrow: "NScalc",
      heroTitle: "Журнал выращивания со встроенным контекстом по питанию.",
      heroBody: "Держите историю культуры, целевые растворы и справочник удобрений рядом, чтобы ежедневные решения было легче проверять и на телефоне, и за рабочим столом.",
      email: "Email",
      password: "Пароль",
      emailPlaceholder: "grower@example.com",
      passwordPlaceholder: "••••••••",
      working: "Подождите...",
      refreshLogin: "Обновить вход",
      logIn: "Войти",
      logOut: "Выйти",
      register: "Регистрация",
      signedInAs: "Вы вошли как",
      moderatorEnabled: "доступно управление модератора",
      language: "Язык",
      currentView: "Раздел",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
    },
    nav: {
      journal: { label: "Журнал", blurb: "Ведите каждую культуру как единую ленту событий." },
      calculator: { label: "Калькулятор", blurb: "Быстро считайте рецепты на сенсорном экране." },
      solutions: { label: "Растворы", blurb: "Сохраняйте повторно используемые целевые смеси." },
      fertilizers: { label: "Удобрения", blurb: "Проверяйте продукты и соотношения элементов." },
      chat: { label: "Чат", blurb: "Раздел для будущей командной работы." },
      about: { label: "О проекте", blurb: "Как журнал и инструменты питания работают вместе." },
    },
    about: {
      eyebrow: "О nscalc",
      title: "Сделано для тех, кому нужны заметки, рецепты и справочные данные в одном месте.",
      body: "Журнал, калькулятор, целевые растворы и библиотека удобрений задуманы как единый ежедневный рабочий процесс, независимо от того, проверяете ли вы бак на телефоне или планируете изменения за столом.",
      aside: "Интерфейс делает ставку на быстрое чтение на мобильных устройствах, понятные формы и близость истории культуры к питательному контексту.",
    },
    footer: {
      summary: "История культур, планирование питания и общие справочники в одном мобильном рабочем пространстве.",
      poweredBy: "Работает на",
    },
    app: {
      auth: {
        enterCredentials: "Введите email и пароль.",
        loginFailedPrefix: "Ошибка входа:",
        noAccountForEmail: "Аккаунт с таким email не найден.",
        incorrectPassword: "Неверный пароль.",
        unknownError: "Неизвестная ошибка.",
        loginFailed: "Не удалось войти.",
        logoutFailed: "Не удалось выйти.",
      },
      chat: {
        eyebrow: "Каркас realtime",
        title: "Чат должен ощущаться как мессенджер, а не как боковая панель таблицы.",
        body: "Удобный чат для телефона требует ленту сообщений, закреплённый внизу композер и чёткое разделение между совместной работой и инструментами расчёта.",
        outgoingMessage: "Потоковый чат уже есть на сервере, но новый клиент может получить нормальную мобильную раскладку разговора.",
        incomingMessage: "Закрепите композер, добавьте чипы вложений и вынесите presence отдельно от ленты.",
        placeholder: "Введите сообщение",
        send: "Отправить",
      },
      priorities: {
        title: "Приоритеты для мобильного",
        items: [
          "Держать контекст истории видимым, пока загрузки продолжаются в фоне.",
          "Сворачивать плотные группы контролов в вертикальные секции.",
          "Не полагаться на hover-сценарии для основных действий.",
        ],
      },
      snapshot: {
        titleSuffix: "снимок",
        labels: {
          account: "Аккаунт",
          journalMode: "Режим журнала",
          sharedEvent: "Общее событие",
          eventDraft: "Черновик события",
          libraryAccess: "Доступ к библиотеке",
          primaryUse: "Основное назначение",
          workflow: "Режим работы",
          catalogAccess: "Доступ к каталогу",
          status: "Статус",
          context: "Контекст",
          nextStep: "Следующий шаг",
          currentView: "Текущий раздел",
          experience: "Опыт",
        },
        values: {
          guest: "Гость",
          admin: "Админ",
          signedIn: "Вошёл",
          loading: "Загрузка",
          liveNow: "Сейчас идёт",
          scheduled: "Запланировано",
          inactive: "Неактивно",
          moderation: "Модерация",
          reader: "Чтение",
          unsaved: "Не сохранено",
          synced: "Синхронизировано",
          personalShared: "Личное + общее",
          sharedOnly: "Только общее",
          targetRecipes: "Целевые рецепты",
          elementRatios: "Соотношения элементов",
          editable: "Можно редактировать",
          readOnly: "Только чтение",
          planned: "Запланировано",
          realtimeSync: "Realtime-синхронизация",
          mobileFirst: "Сначала мобильный",
        },
        details: {
          journalAdminAccount: "В журнале доступны инструменты модератора.",
          journalSignedInAccount: "Действия в историях используют ваш текущий аккаунт.",
          journalGuestAccount: "Просмотр историй без инструментов, привязанных к аккаунту.",
          journalModerationMode: "Можно управлять общей панелью событий и сценариями модерации журнала.",
          journalReaderMode: "Истории, загрузки и полноэкранные медиа остаются удобными для мобильного просмотра.",
          sharedEventRefreshing: "Обновляем состояние общей оверлейной темы с сервера.",
          eventDraftStaged: "Изменения админа пока сохранены локально до явного сохранения.",
          eventDraftSynced: "Конфигурация сервера и локальный черновик совпадают.",
          eventDraftReadonly: "Редактировать общую конфигурацию события могут только админы.",
          solutionsAccountSignedIn: "Ваш список растворов может включать личные и общие цели.",
          solutionsAccountGuest: "В гостевом режиме можно просматривать общую библиотеку растворов.",
          solutionsLibrarySignedIn: "Сохраняйте, обновляйте и удаляйте свои целевые растворы.",
          solutionsLibraryGuest: "Войдите, чтобы создавать и вести личную библиотеку растворов.",
          solutionsPrimaryUse: "Повторно используемые питательные профили питают калькулятор и журнал.",
          solutionsWorkflowSignedIn: "Используйте это пространство для целевых смесей, к которым вы часто возвращаетесь.",
          solutionsWorkflowGuest: "Пока просматривайте цели, а потом войдите, если захотите хранить свой набор.",
          fertilizersAccountSignedIn: "Ваш список удобрений может объединять личные и общие продукты.",
          fertilizersAccountGuest: "В гостевом режиме можно просматривать общий каталог удобрений.",
          fertilizersCatalogSignedIn: "Сохраняйте реально используемые продукты и поддерживайте их анализы в актуальном состоянии.",
          fertilizersCatalogGuest: "Войдите, чтобы вести личный каталог удобрений.",
          fertilizersPrimaryUse: "Анализы продуктов отсюда питают матрицу и решатель калькулятора.",
          fertilizersWorkflowSignedIn: "Настраивайте личные записи, не затрагивая общий справочник.",
          fertilizersWorkflowGuest: "Пока просматривайте справочник, а затем войдите, чтобы сохранить свои продукты.",
          chatAccountSignedIn: "Текущая сессия уже готова для будущих функций совместной работы.",
          chatAccountGuest: "Пока работает гостевой просмотр до появления realtime-чата.",
          chatStatus: "Этот раздел зарезервирован под совместную работу в реальном времени, а не под статические заметки.",
          chatContextAdmin: "Позже админский контекст может покрыть поддержку и модерацию.",
          chatContextUser: "Идентичность пользователя уже готова переходить в будущие чат-сессии.",
          chatNextStep: "Полезный результат здесь — общее обсуждение выращивания, а не ещё одна статическая страница.",
          aboutAccountAdmin: "Для общей конфигурации события доступны админские инструменты.",
          aboutAccountSignedIn: "Во всём приложении активны сценарии для вошедшего пользователя.",
          aboutAccountGuest: "Гостевой режим всё равно открывает общие данные и гостевые расчёты.",
          aboutExperience: "Оболочка делает ставку на читаемые сенсорные сценарии для журнала, калькулятора и библиотек.",
          sharedEventStateRefreshing: "Обновляем состояние события с сервера.",
        },
      },
      event: {
        seasonalEvent: "Сезонное событие",
        isLiveNow: "уже идёт",
        isArmed: "подготовлено",
        hideEventPanel: "Скрыть панель события",
        manageEvent: "Управлять событием",
        adminEyebrow: "Панель события",
        adminTitle: "Управление сезонным рантаймом",
        adminBody: "Эта панель хранит общее расписание на сервере и загружает код визуального эффекта только тогда, когда реально стартует живое событие или предпросмотр.",
        collapse: "Свернуть",
        expand: "Развернуть",
        runtime: "Рантайм",
        schedule: "Расписание",
        runtimeLive: "В эфире",
        runtimeIdle: "Ожидание",
        scheduleActive: "Активно",
        scheduleArmed: "Подготовлено",
        scheduleOff: "Выключено",
        sharedServerEvent: "Общее серверное событие",
        loadingFromServer: "Загрузка с сервера...",
        lastUpdate: (updatedAt, updatedBy) => `Последнее обновление ${updatedAt}${updatedBy ? `, ${updatedBy}` : ""}.`,
        notYetSaved: "ещё не сохранено",
        variant: "Вариант",
        variants: {
          fireworks: "Новогодний фейерверк",
          snow: "Зимний снегопад",
          petals: "Весенние лепестки",
        },
        descriptions: {
          fireworks: "Короткий праздничный салют при открытии страницы.",
          snow: "Медленно падающий снег с лёгкой атмосферной подложкой.",
          petals: "Мягко падающие лепестки сакуры — спокойное весеннее приветствие.",
        },
        enableSharedEvent: "Включить общее событие",
        enableSharedEventHelp: "Держит событие подготовленным в пределах заданного окна.",
        autoplay: "Автозапуск при открытии сайта",
        autoplayHelp: "Если окно не задано, эффект будет запускаться при каждом новом визите в этом браузере.",
        starts: "Начало",
        ends: "Конец",
        duration: "Длительность",
        durationOptions: {
          ten: "10 секунд",
          eighteen: "18 секунд",
          twentyFour: "24 секунды",
          thirty: "30 секунд",
        },
        intensity: "Интенсивность",
        intensities: {
          gentle: "Мягко",
          showtime: "Шоу",
        },
        previewVariant: (variant) => `Предпросмотр: ${variant}`,
        stopPreview: "Остановить предпросмотр",
        clearSchedule: "Очистить расписание",
        resetDraft: "Сбросить черновик",
        saveSharedEvent: "Сохранить общее событие",
        savingSharedEvent: "Сохранение...",
        clearScheduleMessage: "Окно расписания очищено.",
        resetDraftMessage: "Черновик сброшен к серверной конфигурации.",
        stopPreviewMessage: "Предпросмотр остановлен.",
        eventStoppedMessage: "Событие остановлено.",
        alreadyRunning: "Предпросмотр события уже запущен.",
        loadingPreview: "Загрузка предпросмотра события...",
        loadingSeasonal: "Загрузка сезонного события...",
        previewFinished: "Предпросмотр завершён.",
        completed: (variant) => `${variant} завершено.`,
        previewLive: (variant) => `Предпросмотр «${variant}» запущен.`,
        triggered: (variant) => `${variant} запущено.`,
        unableToStart: "Не удалось запустить эффект события.",
        unableLoad: "Не удалось загрузить конфигурацию события.",
        adminRequiredSave: "Войдите как админ, чтобы сохранить изменения события.",
        savingSharedConfig: "Сохраняем конфигурацию общего события...",
        savedForVisitors: (variant) => `Событие «${variant}» сохранено для всех посетителей.`,
        adminExpired: "Сессия администратора истекла. Войдите снова и повторите попытку.",
        unableSave: "Не удалось сохранить конфигурацию события.",
        windowRange: (start, end) => `Работает с ${start} до ${end}`,
        windowStarts: (start) => `Стартует ${start}`,
        windowEnds: (end) => `Работает до ${end}`,
        windowAutoplay: "Работает всегда, когда включён автозапуск.",
      },
    },
    calculator: {
      heroEyebrow: "Калькулятор",
      heroTitle: "Собирайте рецепт по целевым значениям раствора, а не по заметкам вручную.",
      heroBody: "Начинайте с сохранённых целевых растворов, выбирайте удобрения из библиотеки и сравнивайте итоговую смесь с целью до экспорта рецепта.",
      summaryTargetNh4: "Цель NH4 %",
      summaryMixNh4: "Смесь NH4 %",
      summaryMixEc: "EC смеси",
      summaryResidual: "Остаток",
      calculations: "Расчёты",
      calculationName: "Название расчёта",
      calculationNamePlaceholder: "Новый расчёт",
      savedCalculations: "Сохранённые расчёты",
      unsavedDraft: "Черновик",
      guestDraft: "Гостевой расчёт или черновик",
      newAction: "Новый",
      saveAction: "Сохранить",
      savingAction: "Сохранение...",
      deleteAction: "Удалить",
      deletingAction: "Удаление...",
      loadingCalculations: "Загрузка расчётов...",
      guestReadonlyHint: "Гостевые расчёты загружаются с сервера. Войдите, чтобы сохранять и удалять свои расчёты.",
      targetRecipe: "Целевой рецепт",
      searchSolutions: "Поиск растворов",
      searchSolutionsPlaceholder: "Томат, базилик, огурец...",
      solutionPreset: "Шаблон раствора",
      loadingSolutions: "Загрузка растворов...",
      noSolutionsFound: "Растворы не найдены",
      customTarget: "Свой профиль",
      searchMode: "Режим поиска",
      defaultsMode: "Часто используемые",
      searching: "Поиск...",
      loadingMoreSolutions: "Загрузка ещё растворов...",
      loadMoreSolutionMatches: "Показать ещё подходящие растворы",
      noMoreSolutionMatches: "Больше совпадений нет",
      tankVolume: "Объём бака",
      ppmSuffix: "ppm",
      secondaryMicronutrients: "Вторичные + микроэлементы",
      fertilizers: "Удобрения",
      fertilizersBody: "Ищите продукты в библиотеке, выбирайте их и меняйте активные дозировки в одном списке.",
      inputsActive: (count) => `${count} активных позиций`,
      savePdf: "Сохранить PDF",
      savingPdf: "Сохранение PDF...",
      autoSolve: "Авто-подбор доз",
      searchFertilizers: "Поиск удобрений",
      searchFertilizersPlaceholder: "Кальций, сульфат, смесь...",
      searchResults: "Результаты поиска",
      noFertilizersMatch: "По текущему запросу удобрения не найдены.",
      selected: "Выбрано",
      engineMode: "движок",
      manualMode: "вручную",
      gramsPerLiter: "г / л",
      unselect: "Убрать",
      tankMass: "Масса в баке",
      cost: "Стоимость",
      massUnit: "г",
      loadingMoreFertilizers: "Загрузка ещё удобрений...",
      loadMoreFertilizerMatches: "Показать ещё подходящие удобрения",
      noMoreFertilizerMatches: "Больше совпадений нет",
      targetVsMix: "Цель и смесь",
      targetVsMixBody: "Используйте клиентский решатель с данными по растворам и удобрениям и проверяйте отклонения по элементам до фиксации рецепта.",
      targetEcLabel: "EC цели",
      mixEcLabel: "EC смеси",
      nkLabel: "N:K",
      element: "Элемент",
      target: "Цель",
      mix: "Смесь",
      delta: "Отклонение",
      totalTarget: "Сумма цели",
      totalMixed: "Сумма смеси",
      solutionMatrix: "Матрица раствора",
      solutionMatrixBody: "Посмотрите, как каждое выбранное удобрение вносит вклад в каждый элемент, и при необходимости правьте массу напрямую.",
      editMass: "Править массу",
      emptyMatrix: "Выберите удобрения или выполните расчёт, чтобы заполнить матрицу раствора.",
      fertilizerColumn: "Удобрение",
      massColumn: "Масса (г.)",
      modeLabels: { auto: "авто", manual: "вручную" },
      bottleLabels: { A: "Бак A", B: "Бак B", C: "Бак C" },
      messages: {
        pickFertilizers: "Выберите удобрения, чтобы движок подобрал дозы.",
        draftReady: "Черновик расчёта готов.",
        guestDraftReadonly: "Гостевые расчёты доступны только для чтения. Войдите, чтобы сохранить свой черновик.",
        savedRestored: "Сохранённый расчёт восстановлен. Дозы пересчитаны по сохранённому набору удобрений.",
        calculationLoaded: "Расчёт загружен. Выберите удобрения для нового рецепта.",
        noSaved: "Сохранённых расчётов пока нет.",
        noGuest: "Гостевых расчётов нет.",
        signInSave: "Войдите, чтобы сохранять расчёты.",
        saved: "Расчёт сохранён.",
        signInDelete: "Войдите, чтобы удалять сохранённые расчёты.",
        selectSavedToDelete: "Выберите сохранённый расчёт для удаления.",
        deleted: "Расчёт удалён.",
        manualTweak: "Режим ручной правки. Используйте авто-подбор, чтобы вернуться к результату движка.",
        loadTargetBeforeSolve: "Сначала загрузите целевой раствор.",
        pdfDownloaded: "PDF-отчёт сохранён.",
        catalogLoadFailed: "Не удалось загрузить данные каталога для калькулятора с сервера.",
      },
      loadedSavedCalculations: (count) => `Загружено сохранённых расчётов: ${count}.`,
      loadedGuestCalculations: (count) => `Загружено гостевых расчётов: ${count}.`,
      loadedCalculation: (name) => `Загружен расчёт: ${name}.`,
      engineSolved: (count, residual) => `Движок подобрал ${count} позиций удобрений, остаток ${residual.toFixed(1)}.`,
      fallbackNames: {
        defaultCalculation: "Новый расчёт",
        savedCalculation: "Сохранённый расчёт",
        customCalculation: "Свой расчёт",
        customCalculationFile: "custom-calculation",
      },
      errors: {
        failedLoadCalculations: "Не удалось загрузить расчёты.",
        failedSaveCalculation: "Не удалось сохранить расчёт.",
        failedDeleteCalculation: "Не удалось удалить расчёт.",
        exportRequiresTarget: "Перед экспортом PDF выберите цель и хотя бы одно удобрение.",
        failedExportPdf: "Не удалось создать PDF-отчёт.",
        failedBootstrap: "Не удалось загрузить исходные данные калькулятора.",
        failedSearchSolutions: "Не удалось выполнить поиск растворов.",
        failedSearchFertilizers: "Не удалось выполнить поиск удобрений.",
      },
    },
    solutions: {
      heroEyebrow: "Библиотека растворов",
      heroTitle: "Держите повторно используемые целевые рецепты рядом с журналом и калькулятором.",
      loadedCount: (count) => `Загружено: ${count}`,
      moreAvailable: "Есть ещё",
      endOfResults: "Конец списка",
      searchByName: "Поиск по названию",
      searchPlaceholder: "Кальций, огурец, цветение...",
      author: "Автор",
      authorPlaceholder: "superuser, guest...",
      createEyebrow: "Создать раствор",
      createBody: "Соберите новую карточку раствора прямо из каталога и сохраните её на сервере.",
      loginHint: "Войдите, чтобы создавать и редактировать свои растворы.",
      hideForm: "Скрыть форму",
      newSolution: "Новый раствор",
      createMessage: "Создать раствор",
      createName: "Название раствора",
      createNamePlaceholder: "Цель цветения, неделя 3",
      elements: "Элементы",
      creating: "Создание...",
      createAction: "Создать раствор",
      loading: "Загрузка растворов из каталога...",
      noMatches: "Нет растворов по текущим фильтрам.",
      loadingMore: "Загрузка ещё...",
      loadMore: "Показать ещё растворы",
      allLoaded: "Все растворы загружены",
      errors: {
        loginBeforeEdit: "Снова войдите перед редактированием растворов.",
        enterName: "Введите название раствора.",
        invalidElements: "Некорректные значения элементов.",
        failedSave: "Не удалось сохранить раствор.",
        ownOnlyEdit: "Можно редактировать только свои растворы.",
        loginBeforeDelete: "Снова войдите перед удалением растворов.",
        ownOnlyDelete: "Можно удалять только свои растворы.",
        failedDelete: "Не удалось удалить раствор.",
        loginBeforeCreate: "Войдите перед созданием растворов.",
        failedCreate: "Не удалось создать раствор.",
        failedLoad: "Не удалось загрузить растворы.",
        failedLoadMore: "Не удалось загрузить ещё растворы.",
      },
      messages: {
        saving: "Сохранение раствора...",
        saved: "Раствор сохранён.",
        deleted: "Раствор удалён.",
        creating: "Создание раствора...",
        created: "Раствор создан.",
      },
      confirmDelete: (name) => `Удалить раствор "${name}"?`,
      card: {
        solutionIndex: (index) => `Раствор #${index}`,
        byPrefix: "автор",
        liveTarget: "Актуальная цель",
        editor: "Редактор раствора",
        close: "Закрыть",
        edit: "Редактировать",
        delete: "Удалить",
        name: "Название",
        elements: "Элементы",
        save: "Сохранить раствор",
        saving: "Сохранение...",
        ratios: "Соотношения",
      },
    },
    assistant: {
      heroEyebrow: "ИИ-ассистент",
      heroTitle: "Опишите культуру — получите целевой раствор.",
      heroBody: "Расскажите, что вы выращиваете (или прикрепите фото этикетки удобрения), и ассистент предложит и сохранит раствор или удобрение для вас.",
      promptPlaceholder: "Выращиваю салат на стадии вегетации...",
      loginHint: "Войдите, чтобы попросить ассистента создать или изменить растворы.",
      ask: "Спросить ассистента",
      asking: "Думаю...",
      hide: "Скрыть",
      open: "Открыть ИИ-ассистента",
      expand: "На весь экран",
      exitFullscreen: "Свернуть",
      clearChat: "Очистить чат",
      emptyChat: "Спросите о культурах, растворах или этикетках удобрений — переписка хранится в этом браузере.",
      youLabel: "Вы",
      assistantLabel: "Ассистент",
      photoAttachedNote: "Фото прикреплено",
      toolCallLabel: (toolName) => `Выполняю: ${toolName}...`,
      solutionUpdatedLabel: (name) => `Обновлён раствор: ${name}`,
      fertilizerUpdatedLabel: (name) => `Обновлено удобрение: ${name}`,
      attachPhoto: "Прикрепить фото удобрения",
      photoAttached: "Фото прикреплено",
      removePhoto: "Убрать",
      errors: {
        notLoggedIn: "Войдите перед обращением к ассистенту.",
        unavailable: "ИИ-ассистент сейчас недоступен.",
        failed: "Не удалось получить ответ от ассистента.",
        invalidImage: "Не удалось прочитать это изображение — попробуйте другое фото.",
      },
    },
    fertilizers: {
      heroEyebrow: "Полка удобрений",
      heroTitle: "Держите карточки продуктов читаемыми на телефоне и достаточно плотными для рабочего каталога.",
      searchProducts: "Поиск продуктов",
      searchPlaceholder: "Магний, сульфат, нитрат...",
      loadedCount: (count) => `Загружено: ${count}`,
      moreAvailable: "Есть ещё",
      endOfResults: "Конец списка",
      createEyebrow: "Создать удобрение",
      createBody: "Добавьте новый продукт по имени, парсер формулы заполнит карточку.",
      loginHint: "Войдите, чтобы создавать и редактировать свои удобрения.",
      hideForm: "Скрыть форму",
      newFertilizer: "Новое удобрение",
      name: "Название удобрения",
      namePlaceholder: "Кальциевая селитра, маточный раствор",
      formula: "Формула",
      formulaPlaceholder: "bottle := A; formula Ca(NO3)2 * 4H2O purity 99.8;",
      creating: "Создание...",
      createAction: "Создать удобрение",
      loading: "Загрузка удобрений из каталога...",
      noMatches: "По текущему поиску удобрения не найдены.",
      productCard: "Карточка продукта",
      byPrefix: "автор",
      noFormulaSaved: "Формула не сохранена.",
      formulaEditor: "Редактор формулы",
      close: "Закрыть",
      editFormula: "Редактировать формулу",
      delete: "Удалить",
      backendParsedFormula: "Формула для парсера",
      verify: "Проверить",
      verifying: "Проверка...",
      reset: "Сбросить",
      loadingMore: "Загрузка ещё...",
      loadMore: "Показать ещё удобрения",
      allLoaded: "Все удобрения загружены",
      bottleLabels: { A: "Бак A", B: "Бак B", C: "Бак C" },
      errors: {
        loginBeforeEdit: "Снова войдите перед редактированием удобрений.",
        enterFormula: "Введите формулу перед проверкой.",
        ownOnlyEdit: "Можно редактировать только свои удобрения.",
        failedVerify: "Не удалось проверить формулу удобрения.",
        loginBeforeDelete: "Снова войдите перед удалением удобрений.",
        ownOnlyDelete: "Можно удалять только свои удобрения.",
        failedDelete: "Не удалось удалить удобрение.",
        loginBeforeCreate: "Войдите перед созданием удобрений.",
        enterName: "Введите название удобрения.",
        enterFormulaCreate: "Введите формулу перед созданием удобрения.",
        failedCreate: "Не удалось создать удобрение.",
        failedLoad: "Не удалось загрузить удобрения.",
        failedLoadMore: "Не удалось загрузить ещё удобрения.",
      },
      messages: {
        verifying: "Проверка формулы на сервере...",
        verified: "Проверено. Распознанные элементы обновлены с сервера.",
        deleted: "Удобрение удалено.",
        creating: "Создание удобрения...",
        created: "Удобрение создано.",
      },
      confirmDelete: (name) => `Удалить удобрение "${name}"?`,
    },
    journal: {
      heroEyebrow: "Журнал выращивания",
      heroTitle: "Держите всю историю культуры в одной ленте, от первой высадки до финального сбора.",
      heroBody: "Используйте истории, чтобы хранить решения, измерения, фото и видео вместе и потом понимать, что именно изменилось и почему.",
      summaryStories: "Истории",
      summaryUpdates: "Обновления",
      summaryPendingUploads: "Ожидают загрузки",
      searchStories: "Поиск историй",
      searchPlaceholder: "Базилик, томат, бак...",
      stage: "Стадия",
      createEyebrow: "Создать историю",
      createBody: "Начните журнал для грядки, стеллажа, бака или тестовой партии, а затем добавляйте обновления по мере развития культуры.",
      createAction: "Создать историю",
      creatingAction: "Создание...",
      title: "Название",
      titlePlaceholder: "Перезапуск бака, неделя 1",
      crop: "Культура",
      cropPlaceholder: "Томат, базилик, салат...",
      visibility: "Видимость",
      solutionId: "ID раствора",
      optional: "Необязательно",
      description: "Описание",
      visibleStories: "видимых историй",
      total: "всего",
      loadingStories: "Загрузка историй...",
      noStoriesMatch: "Нет историй по текущему фильтру.",
      noSolutionLinked: "Раствор не привязан",
      storyCardHint: "Нажмите на карточку, чтобы открыть историю в отдельном фокусном окне и сохранить компактную основную ленту.",
      storyModal: "История",
      deleteStory: "Удалить историю",
      deletingStory: "Удаление...",
      close: "Закрыть",
      cover: "Обложка",
      openFullScreen: "Открыть на весь экран",
      image: "Изображение",
      coverHelp: "Обложка обновляется из прикреплённых изображений и постеров видео.",
      noCoverImage: "Обложки пока нет. Добавьте фото или видео, и оно появится здесь.",
      liveWatch: "Живые обновления",
      liveWatchHelp: "Новые записи, прогресс загрузок и прикреплённые файлы появляются здесь без ручного обновления.",
      moderator: "Модератор",
      moderatorFallback: "Модератор",
      moderatorHelp: "Удаление убирает историю, её ленту и метаданные медиа. Опубликованные файлы очищаются на сервере.",
      created: "Создано",
      lastUpdate: "Последнее обновление",
      timelineDepth: "Глубина ленты",
      entries: "записей",
      loadingStoryTimeline: "Загрузка ленты истории...",
      untitledUpdate: "Обновление без названия",
      followUp: "Продолжить",
      mediaOnlyEntry: "Запись только с медиа.",
      tapPreview: "Нажмите на превью, чтобы открыть изображение целиком, не покидая ленту.",
      openImage: "Открыть изображение",
      adaptiveReady: "Адаптивное воспроизведение готово.",
      playVideo: "Смотреть видео",
      adaptivePending: "Адаптивное воспроизведение появится после завершения обработки видео.",
      uploadQueue: "Очередь загрузок",
      percentComplete: "завершено",
      noUploadActivity: "Пока нет активности загрузок. Добавьте файлы ниже, и они прикрепятся к этой истории после завершения загрузки.",
      storyDirection: "Краткая сводка",
      quickCompose: "Быстрая запись",
      quickComposeHelp: "Сначала создаётся запись, затем выбранные изображения и видео загружаются и прикрепляются к ней. Текст необязателен, если есть медиа.",
      dismissStoryHint: "Нажмите вне окна, Esc или кнопку Закрыть, чтобы выйти из истории.",
      entryType: "Тип записи",
      mixedMediaHint: "Смешанные медиа будут разделены на отдельные фото- и видео-записи.",
      autoSetHintPrefix: "Автоматически выбран тип",
      body: "Текст",
      bodyPlaceholder: "Необязательно, если вы прикладываете только медиа.",
      attachMedia: "Прикрепить медиа",
      remove: "Убрать",
      posting: "Публикация...",
      postSplitMediaUpdates: "Опубликовать разделённые медиа-записи",
      postUpdateAndUploadSuffix: "запись и загрузить медиа",
      postUpdateSuffix: "запись",
      storyMedia: "Медиа истории",
      imageViewer: "Просмотр изображения",
      previous: "Назад",
      next: "Вперёд",
      previousMediaAria: "Предыдущее медиа",
      nextMediaAria: "Следующее медиа",
      liveUpdatesOn: "Живые обновления включены",
      liveUpdatesConnecting: "Подключение живых обновлений",
      liveUpdatesUnavailable: "Живые обновления недоступны",
      liveUpdatesOff: "Живые обновления выключены",
      storyCreated: "История создана.",
      updatePostedUploaded: "Запись опубликована, медиа загружены.",
      updatePosted: "Запись опубликована.",
      updatePostedFailedUploads: "Запись опубликована, но одна или несколько загрузок не удались.",
      mixedMediaSplitMessage: "Смешанные медиа разделены на отдельные фото- и видео-записи.",
      couldNotLoadStories: "Не удалось загрузить истории.",
      couldNotLoadStoryDetails: "Не удалось загрузить детали истории.",
      couldNotCreateStory: "Не удалось создать историю.",
      couldNotCreateUpdate: "Не удалось создать запись.",
      uploadFailed: "ошибка загрузки",
      uploadRetrying: "Загрузка прервалась. Повтор",
      confirmDeleteStory: "Удалить историю",
      deletedByModeratorSuffix: "удалена пользователем",
      couldNotDeleteStory: "Не удалось удалить историю.",
      latestUpdate: "последнее обновление",
      draftedFollowUpFor: "Черновик продолжения для",
      followUpPrefix: "Продолжение:",
      followUpBodyPrefix: "Продолжение к:",
      couldNotConnectLiveUpdates: "Не удалось подключить живые обновления истории.",
      liveUpdatesDisconnected: "Соединение живых обновлений истории потеряно.",
      loggedFromJournal: "Записано из журнала выращивания.",
      labels: {
        allStages: "Все стадии",
        stages: {
          Planning: "Планирование",
          Germination: "Прорастание",
          Vegetative: "Вегетация",
          Flowering: "Цветение",
          Harvest: "Сбор",
          Archived: "Архив",
        },
        visibilities: {
          Private: "Приватно",
          Unlisted: "По ссылке",
          Public: "Публично",
        },
        updateKinds: {
          Note: "Заметка",
          Measurement: "Замер",
          PhotoSet: "Фото",
          Video: "Видео",
        },
        mediaKinds: {
          Image: "Изображение",
          Video: "Видео",
        },
        mediaStatuses: {
          PendingUpload: "Ожидает загрузки",
          Uploading: "Загрузка",
          Queued: "В очереди",
          Processing: "Обработка",
          Ready: "Готово",
          Failed: "Ошибка",
        },
        photo: "фото",
        photos: "Фото",
        video: "видео",
      },
      videoPlayer: {
        loading: "Загрузка видео...",
        failed: "Не удалось воспроизвести",
        retry: "Повторить",
        meta: "Адаптивное воспроизведение видео",
        receivedSuffix: "получено",
      },
    },
  },
};

export function resolveLocale(input: string | null | undefined): Locale {
  const normalized = input?.toLowerCase() ?? "";
  return normalized.startsWith("ru") ? "ru" : "en";
}