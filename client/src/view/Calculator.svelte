<script lang="ts">
  import * as NPRPC from "nprpc";
  import * as nscalc from "@rpc/nscalc";
  import { onMount } from "svelte";
  import type { CalculatorCopy } from "../lib/i18n";
  import type { Calculation as RpcCalculation, Fertilizer as RpcFertilizer, Solution as RpcSolution } from "@rpc/nscalc";
  import {
    computeElementsFromDoses,
    computeSolutionEc,
    computeSolutionRatio,
    elementOrder,
    solveRecipe,
    solutionElementsFromRecord,
    type ElementKey,
    type FertilizerInput,
    type SolutionElements,
  } from "../lib/calculatorEngine";
  import { saveCalculatorReportPdf } from "../lib/calculatorPdf";
  import { fertilizerCardFromRpc } from "../lib/catalogData";
  import { getNscalcRpc } from "../lib/nscalcRpc";
  import { getCalculatorBootstrapCached, listFertilizersPageCached, listSolutionsPageCached } from "../lib/catalogRpcCache";

  type SelectedFertilizer = {
    fertilizerId: number;
    gramsPerLiter: number;
  };
  type MixMetric = {
    key: ElementKey;
    label: string;
    target: number;
    mixed: number;
    delta: number;
  };

  const featuredElements: ElementKey[] = ["NO3", "NH4", "P", "K", "Ca", "Mg"];
  const traceElements: ElementKey[] = ["S", "Cl", "Fe", "Zn", "B", "Mn", "Cu", "Mo"];

  let {
    currentUser = null,
    uiText,
  }: {
    currentUser?: nscalc.RegisteredUser | null;
    uiText: CalculatorCopy;
  } = $props();

  let calculationName = $state(uiText.fallbackNames.defaultCalculation);
  let activeCalculationId = $state<number | null>(null);
  let savedCalculations = $state<RpcCalculation[]>([]);
  let loadingCalculations = $state(false);
  let savingCalculation = $state(false);
  let deletingCalculation = $state(false);
  let calculationError = $state<string | null>(null);
  let calculationMessage = $state<string | null>(null);
  let selectedSolutionId = $state<number | null>(null);
  let targetElements = $state<SolutionElements>(createEmptySolutionElements());
  let volumeLiters = $state(40);
  let solutionSearch = $state("");
  let fertilizerSearch = $state("");
  let calculatorMode = $state<"auto" | "manual">("auto");
  let solverMessage = $state<string | null>(null);
  let catalogError = $state<string | null>(null);
  let loadingBootstrap = $state(true);
  let loadingSolutionSearch = $state(false);
  let loadingFertilizerSearch = $state(false);
  let loadingMoreSolutions = $state(false);
  let loadingMoreFertilizers = $state(false);
  let exportBusy = $state(false);
  let matrixEditMode = $state(false);
  let nextSolutionCursor = $state<string | null>(null);
  let nextFertilizerCursor = $state<string | null>(null);
  let bootstrapSolutions = $state<RpcSolution[]>([]);
  let bootstrapFertilizers = $state<RpcFertilizer[]>([]);
  let solutionSearchResults = $state<RpcSolution[]>([]);
  let fertilizerSearchResults = $state<RpcFertilizer[]>([]);
  let solutionRequestToken = 0;
  let fertilizerRequestToken = 0;
  let solutionDebounceHandle: ReturnType<typeof setTimeout> | null = null;
  let fertilizerDebounceHandle: ReturnType<typeof setTimeout> | null = null;
  let selectedFertilizers = $state<SelectedFertilizer[]>([]);
  let calculationsHydrated = false;

  onMount(() => {
    void loadBootstrap();
  });

  $effect(() => {
    currentUser;
    if (loadingBootstrap) {
      return;
    }

    void loadCalculations();
  });

  $effect(() => {
    solutionSearch;
    if (loadingBootstrap) {
      return;
    }

    if (solutionDebounceHandle) {
      clearTimeout(solutionDebounceHandle);
    }

    const query = solutionSearch.trim();
    if (query.length === 0) {
      solutionSearchResults = [];
      nextSolutionCursor = null;
      loadingSolutionSearch = false;
      return;
    }

    solutionDebounceHandle = setTimeout(() => {
      void searchSolutions(true);
    }, 180);

    return () => {
      if (solutionDebounceHandle) {
        clearTimeout(solutionDebounceHandle);
      }
    };
  });

  $effect(() => {
    fertilizerSearch;
    if (loadingBootstrap) {
      return;
    }

    if (fertilizerDebounceHandle) {
      clearTimeout(fertilizerDebounceHandle);
    }

    const query = fertilizerSearch.trim();
    if (query.length === 0) {
      fertilizerSearchResults = [];
      nextFertilizerCursor = null;
      loadingFertilizerSearch = false;
      return;
    }

    fertilizerDebounceHandle = setTimeout(() => {
      void searchFertilizers(true);
    }, 180);

    return () => {
      if (fertilizerDebounceHandle) {
        clearTimeout(fertilizerDebounceHandle);
      }
    };
  });

  const solutionCatalog = $derived.by(() => dedupeById([...bootstrapSolutions, ...solutionSearchResults]));
  const fertilizerCatalog = $derived.by(() => dedupeById([...bootstrapFertilizers, ...fertilizerSearchResults]));
  const availableSolutions = $derived.by(() => (solutionSearch.trim().length > 0 ? solutionSearchResults : bootstrapSolutions));
  const availableFertilizers = $derived.by(() => (fertilizerSearch.trim().length > 0 ? fertilizerSearchResults : bootstrapFertilizers));
  const selectedSolution = $derived.by(() => {
    if (selectedSolutionId !== null) {
      const match = solutionCatalog.find((solution) => solution.id === selectedSolutionId);
      if (match) {
        return match;
      }
    }
    return availableSolutions[0] ?? null;
  });
  const solutionSelectOptions = $derived.by(() => {
    const seed = selectedSolution ? [selectedSolution, ...availableSolutions] : availableSolutions;
    return dedupeById(seed);
  });
  const selectedFertilizerRows = $derived.by(() => {
    return selectedFertilizers
      .map((entry) => {
        const fertilizer = fertilizerCatalog.find((item) => item.id === entry.fertilizerId);
        if (!fertilizer) {
          return null;
        }

        return {
          ...entry,
          fertilizer,
          fertilizerCard: fertilizerCardFromRpc(fertilizer),
          totalGrams: entry.gramsPerLiter * volumeLiters,
          estimatedCost: entry.gramsPerLiter * volumeLiters * fertilizer.cost,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  });
  const selectedFertilizerIdSet = $derived.by(() => new Set(selectedFertilizers.map((entry) => entry.fertilizerId)));
  const combinedFertilizerList = $derived.by(() => {
    const remaining = availableFertilizers.filter((fertilizer) => !selectedFertilizerIdSet.has(fertilizer.id));
    return {
      selected: selectedFertilizerRows,
      remaining,
    };
  });

  const selectedFertilizerInputs = $derived.by<FertilizerInput[]>(() => {
    return selectedFertilizerRows.map((row) => ({
      id: row.fertilizer.id,
      name: row.fertilizer.name,
      cost: row.fertilizer.cost,
      elements: {
        NO3: row.fertilizer.elements[0] ?? 0,
        NH4: row.fertilizer.elements[1] ?? 0,
        P: row.fertilizer.elements[2] ?? 0,
        K: row.fertilizer.elements[3] ?? 0,
        Ca: row.fertilizer.elements[4] ?? 0,
        Mg: row.fertilizer.elements[5] ?? 0,
        S: row.fertilizer.elements[6] ?? 0,
      },
    }));
  });

  const mixedElements = $derived.by<SolutionElements>(() => {
    return computeElementsFromDoses(selectedFertilizerInputs, selectedFertilizerRows.map((row) => row.gramsPerLiter));
  });

  const targetRatio = $derived.by(() => computeSolutionRatio(targetElements));
  const mixRatio = $derived.by(() => computeSolutionRatio(mixedElements));
  const targetEc = $derived.by(() => computeSolutionEc(targetElements));
  const mixEc = $derived.by(() => computeSolutionEc(mixedElements));
  const activeCalculationSelectValue = $derived.by(() => (activeCalculationId === null ? "" : String(activeCalculationId)));

  const mixMetrics = $derived.by<MixMetric[]>(() => {
    return elementOrder.map((key) => {
      const target = targetElements[key] ?? 0;
      const mixed = mixedElements[key] ?? 0;
      return {
        key,
        label: key,
        target,
        mixed,
        delta: mixed - target,
      };
    });
  });

  const targetTotal = $derived.by(() => mixMetrics.reduce((sum, metric) => sum + metric.target, 0));
  const mixedTotal = $derived.by(() => mixMetrics.reduce((sum, metric) => sum + metric.mixed, 0));
  const estimatedEc = $derived.by(() => mixEc.ec);
  const estimatedCost = $derived.by(() => selectedFertilizerRows.reduce((sum, row) => sum + row.estimatedCost, 0));
  const doseSummary = $derived.by(() => selectedFertilizerRows.reduce((sum, row) => sum + row.gramsPerLiter, 0));
  const solverResidual = $derived.by(() => Math.sqrt(mixMetrics.reduce((sum, metric) => sum + metric.delta * metric.delta, 0)));
  const matrixRows = $derived.by(() => {
    return selectedFertilizerRows.map((row) => ({
      id: row.fertilizer.id,
      name: row.fertilizer.name,
      contributions: Object.fromEntries(
        elementOrder.map((key, index) => [key, (row.fertilizer.elements[index] ?? 0) * row.gramsPerLiter]),
      ) as Record<ElementKey, number>,
      totalGrams: row.totalGrams,
    }));
  });

  function setSelectedSolution(id: number): void {
    selectedSolutionId = id;
    const match = solutionCatalog.find((solution) => solution.id === id);
    if (match) {
      targetElements = solutionElementsFromRpcSolution(match);
    }
    solveSelectedDoses();
  }

  function createEmptySolutionElements(): SolutionElements {
    return Object.fromEntries(elementOrder.map((key) => [key, 0])) as SolutionElements;
  }

  function solutionElementsFromRpcSolution(solution: RpcSolution): SolutionElements {
    return solutionElementsFromRecord({
      NO3: solution.elements[0] ?? 0,
      NH4: solution.elements[1] ?? 0,
      P: solution.elements[2] ?? 0,
      K: solution.elements[3] ?? 0,
      Ca: solution.elements[4] ?? 0,
      Mg: solution.elements[5] ?? 0,
      S: solution.elements[6] ?? 0,
      Cl: solution.elements[7] ?? 0,
      Fe: solution.elements[8] ?? 0,
      Zn: solution.elements[9] ?? 0,
      B: solution.elements[10] ?? 0,
      Mn: solution.elements[11] ?? 0,
      Cu: solution.elements[12] ?? 0,
      Mo: solution.elements[13] ?? 0,
    });
  }

  function createCalculationName(): string {
    return selectedSolution?.name ?? uiText.fallbackNames.defaultCalculation;
  }

  function resetDraftCalculation(): void {
    activeCalculationId = null;
    calculationName = createCalculationName();
    targetElements = selectedSolution ? solutionElementsFromRpcSolution(selectedSolution) : createEmptySolutionElements();
    volumeLiters = 40;
    selectedFertilizers = [];
    calculatorMode = "auto";
    solverMessage = uiText.messages.pickFertilizers;
    calculationError = null;
    calculationMessage = currentUser ? uiText.messages.draftReady : uiText.messages.guestDraftReadonly;
  }

  function parseStoredElements(elementsJSON: string): SolutionElements {
    try {
      const tuples = JSON.parse(elementsJSON) as Array<[number, number, number]>;
      return Object.fromEntries(
        elementOrder.map((key, index) => {
          const tuple = tuples[index];
          return [key, Number.isFinite(tuple?.[1]) ? tuple[1] : Number.isFinite(tuple?.[0]) ? tuple[0] : 0];
        }),
      ) as SolutionElements;
    } catch {
      return createEmptySolutionElements();
    }
  }

  function parseStoredFertilizerIds(idsJSON: string): number[] {
    try {
      const ids = JSON.parse(idsJSON) as number[];
      return ids.filter((id) => Number.isFinite(id));
    } catch {
      return [];
    }
  }

  function sameElements(left: SolutionElements, right: SolutionElements): boolean {
    return elementOrder.every((key) => Math.abs((left[key] ?? 0) - (right[key] ?? 0)) < 0.001);
  }

  function findMatchingSolutionId(elements: SolutionElements): number | null {
    for (const solution of solutionCatalog) {
      if (sameElements(solutionElementsFromRpcSolution(solution), elements)) {
        return solution.id;
      }
    }
    return null;
  }

  function applyCalculation(record: RpcCalculation): void {
    const storedElements = parseStoredElements(record.elements);
    const fertilizerIds = parseStoredFertilizerIds(record.fertilizersIds);

    activeCalculationId = record.id;
    calculationName = record.name || uiText.fallbackNames.savedCalculation;
    targetElements = storedElements;
    selectedSolutionId = findMatchingSolutionId(storedElements);
    volumeLiters = Number.isFinite(record.volume) && record.volume > 0 ? record.volume : 40;
    selectedFertilizers = fertilizerIds.map((fertilizerId) => ({ fertilizerId, gramsPerLiter: 0 }));
    calculatorMode = record.mode ? "manual" : "auto";

    queueMicrotask(() => {
      if (fertilizerIds.length > 0) {
        solveSelectedDoses();
        if (record.mode) {
          solverMessage = uiText.messages.savedRestored;
        }
      } else {
        solverMessage = uiText.messages.calculationLoaded;
      }
    });
  }

  async function ensureCalculationCatalogCoverage(): Promise<void> {
    if (calculationsHydrated) {
      return;
    }

    const { calculator } = await getNscalcRpc();
    const data = await calculator.http.GetData();
    bootstrapSolutions = dedupeById([...data.solutions, ...bootstrapSolutions]);
    bootstrapFertilizers = dedupeById([...data.fertilizers, ...bootstrapFertilizers]);
    calculationsHydrated = true;
  }

  async function loadCalculations(preferredId?: number | null): Promise<void> {
    loadingCalculations = true;
    calculationError = null;

    try {
      const { calculator } = await getNscalcRpc();
      const calculations = currentUser
        ? await (async () => {
            const calculationsRef = NPRPC.make_ref<RpcCalculation[]>();
            await currentUser.GetMyCalculations(calculationsRef);
            return calculationsRef.value ?? [];
          })()
        : await calculator.http.GetGuestCalculations();

      savedCalculations = calculations;

      if (calculations.length > 0) {
        await ensureCalculationCatalogCoverage();
        const nextId = preferredId ?? activeCalculationId ?? calculations[0]?.id ?? null;
        const selectedCalculation = calculations.find((record) => record.id === nextId) ?? calculations[0];
        if (selectedCalculation) {
          applyCalculation(selectedCalculation);
        }
      } else if (activeCalculationId !== null || calculationName === uiText.fallbackNames.defaultCalculation) {
        resetDraftCalculation();
      }

      calculationMessage = currentUser
        ? calculations.length > 0
          ? uiText.loadedSavedCalculations(calculations.length)
          : uiText.messages.noSaved
        : calculations.length > 0
          ? uiText.loadedGuestCalculations(calculations.length)
          : uiText.messages.noGuest;
    } catch (error) {
      calculationError = error instanceof Error ? error.message : uiText.errors.failedLoadCalculations;
    } finally {
      loadingCalculations = false;
    }
  }

  function handleCalculationSelection(value: string): void {
    if (!value) {
      resetDraftCalculation();
      return;
    }

    const record = savedCalculations.find((item) => item.id === Number(value));
    if (record) {
      applyCalculation(record);
      calculationMessage = uiText.loadedCalculation(record.name);
      calculationError = null;
    }
  }

  function serializeCalculation(): RpcCalculation {
    return {
      id: activeCalculationId ?? 0,
      name: calculationName.trim() || createCalculationName(),
      elements: JSON.stringify(elementOrder.map((key) => {
        const value = targetElements[key] ?? 0;
        return [value, value, 0.5];
      })),
      fertilizersIds: JSON.stringify(selectedFertilizers.map((entry) => entry.fertilizerId)),
      volume: volumeLiters,
      mode: calculatorMode === "manual",
    };
  }

  async function saveCalculation(): Promise<void> {
    if (!currentUser) {
      calculationMessage = uiText.messages.signInSave;
      return;
    }

    savingCalculation = true;
    calculationError = null;

    try {
      const savedId = await currentUser.UpdateCalculation(serializeCalculation());
      await loadCalculations(savedId);
      calculationMessage = uiText.messages.saved;
    } catch (error) {
      calculationError = error instanceof Error ? error.message : uiText.errors.failedSaveCalculation;
    } finally {
      savingCalculation = false;
    }
  }

  async function deleteCalculation(): Promise<void> {
    if (!currentUser || activeCalculationId === null) {
      calculationMessage = !currentUser ? uiText.messages.signInDelete : uiText.messages.selectSavedToDelete;
      return;
    }

    deletingCalculation = true;
    calculationError = null;

    try {
      await currentUser.DeleteCalculation(activeCalculationId);
      activeCalculationId = null;
      await loadCalculations(null);
      calculationMessage = uiText.messages.deleted;
    } catch (error) {
      calculationError = error instanceof Error ? error.message : uiText.errors.failedDeleteCalculation;
    } finally {
      deletingCalculation = false;
    }
  }

  function toggleFertilizer(fertilizerId: number): void {
    const existing = selectedFertilizers.find((entry) => entry.fertilizerId === fertilizerId);
    if (existing) {
      selectedFertilizers = selectedFertilizers.filter((entry) => entry.fertilizerId !== fertilizerId);
      solveSelectedDoses();
      return;
    }

    selectedFertilizers = [
      ...selectedFertilizers,
      { fertilizerId, gramsPerLiter: suggestedDoseFor(fertilizerId) },
    ];
    solveSelectedDoses();
  }

  function unselectFertilizer(fertilizerId: number): void {
    if (!isSelected(fertilizerId)) {
      return;
    }
    toggleFertilizer(fertilizerId);
  }

  function updateDose(fertilizerId: number, gramsPerLiterText: string): void {
    const gramsPerLiter = Number.parseFloat(gramsPerLiterText);
    calculatorMode = "manual";
    solverMessage = uiText.messages.manualTweak;
    selectedFertilizers = selectedFertilizers.map((entry) => {
      if (entry.fertilizerId !== fertilizerId) {
        return entry;
      }
      return {
        ...entry,
        gramsPerLiter: Number.isFinite(gramsPerLiter) && gramsPerLiter >= 0 ? gramsPerLiter : 0,
      };
    });
  }

  function updateMass(fertilizerId: number, totalGramsText: string): void {
    const totalGrams = Number.parseFloat(totalGramsText);
    const gramsPerLiter = volumeLiters > 0 ? totalGrams / volumeLiters : 0;
    updateDose(fertilizerId, Number.isFinite(gramsPerLiter) ? String(gramsPerLiter) : "0");
  }

  function solveSelectedDoses(): void {
    if (elementOrder.every((key) => (targetElements[key] ?? 0) === 0)) {
      solverMessage = uiText.messages.loadTargetBeforeSolve;
      return;
    }

    if (selectedFertilizerRows.length === 0) {
      calculatorMode = "auto";
      solverMessage = uiText.messages.pickFertilizers;
      return;
    }

    const solveResult = solveRecipe(targetElements, selectedFertilizerInputs);
    selectedFertilizers = selectedFertilizerRows.map((row, index) => ({
      fertilizerId: row.fertilizer.id,
      gramsPerLiter: roundDose(solveResult.doses[index] ?? 0),
    }));
    calculatorMode = "auto";
    solverMessage = uiText.engineSolved(selectedFertilizerRows.length, solveResult.residual);
  }

  function suggestedDoseFor(fertilizerId: number): number {
    return 0.18 + ((fertilizerId * 13) % 7) * 0.08;
  }

  function isSelected(fertilizerId: number): boolean {
    return selectedFertilizers.some((entry) => entry.fertilizerId === fertilizerId);
  }

  function metricTone(delta: number): string {
    const absDelta = Math.abs(delta);
    if (absDelta < 5) {
      return "text-emerald-200";
    }
    if (absDelta < 20) {
      return "text-sand-100";
    }
    return "text-rose-200";
  }

  function formatPpm(value: number): string {
    return value >= 10 ? value.toFixed(0) : value.toFixed(2);
  }

  function formatMass(value: number): string {
    return value >= 10 ? value.toFixed(0) : value.toFixed(2);
  }

  function formatMoney(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  function bottleLabel(bottle: nscalc.FertilizerBottle): string {
    return bottle === nscalc.FertilizerBottle.A ? uiText.bottleLabels.A : bottle === nscalc.FertilizerBottle.B ? uiText.bottleLabels.B : uiText.bottleLabels.C;
  }

  function bottleBadgeClass(bottle: nscalc.FertilizerBottle | null | undefined): string {
    if (bottle === nscalc.FertilizerBottle.B) {
      return "border-emerald-300/30 bg-emerald-400/14 text-emerald-100";
    }
    if (bottle === nscalc.FertilizerBottle.C) {
      return "border-rose-300/30 bg-rose-400/14 text-rose-100";
    }
    return "border-sand-200/35 bg-sand-200/12 text-sand-50";
  }

  function selectedBottleCardClass(bottle: nscalc.FertilizerBottle | null | undefined, formula?: string | null): string {
    if (bottle === nscalc.FertilizerBottle.B) {
      return "border-emerald-300/35 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),rgba(255,255,255,0.06))]";
    }
    if (bottle === nscalc.FertilizerBottle.C) {
      return "border-rose-300/35 bg-[linear-gradient(180deg,rgba(251,113,133,0.12),rgba(255,255,255,0.06))]";
    }
    return "border-sand-200/35 bg-[linear-gradient(180deg,rgba(234,208,162,0.12),rgba(255,255,255,0.06))]";
  }

  function remainingBottleCardClass(bottle: nscalc.FertilizerBottle | null | undefined, formula?: string | null): string {
    if (bottle === nscalc.FertilizerBottle.B) {
      return "border-emerald-300/22 bg-emerald-950/18 hover:bg-emerald-400/10";
    }
    if (bottle === nscalc.FertilizerBottle.C) {
      return "border-rose-300/22 bg-rose-950/16 hover:bg-rose-400/10";
    }
    return "border-sand-200/22 bg-sand-200/8 hover:bg-sand-200/12";
  }

  function formatRatio(value: number): string {
    return value === 0 ? "0.00" : value.toFixed(2);
  }

  function formatMatrixContribution(value: number): string {
    return value < 0.001 ? "" : value.toFixed(2);
  }

  function roundDose(value: number): number {
    return Math.max(0, Math.round(value * 1000) / 1000);
  }

  async function savePdf(): Promise<void> {
    if (!selectedSolution || selectedFertilizerRows.length === 0) {
      solverMessage = uiText.errors.exportRequiresTarget;
      return;
    }

    exportBusy = true;
    try {
      const report = {
        solutionName: calculationName.trim() || selectedSolution?.name || uiText.fallbackNames.customCalculation,
        volumeLiters,
        rows: selectedFertilizerRows.map((row) => ({
          name: row.fertilizer.name,
          bottle: row.fertilizerCard.bottle,
          type: row.fertilizer.type,
          density: row.fertilizer.density,
          gramsPerLiter: row.gramsPerLiter,
          totalGrams: row.totalGrams,
        })),
        metrics: mixMetrics.map((metric) => ({
          key: metric.key,
          target: metric.target,
          mixed: metric.mixed,
          delta: metric.delta,
        })),
        totalTarget: targetTotal,
        totalMixed: mixedTotal,
        ratio: mixRatio,
        estimatedCost,
      };
      await saveCalculatorReportPdf(report, `${(calculationName.trim() || selectedSolution?.name || uiText.fallbackNames.customCalculationFile).replace(/\s+/g, "-")}-recipe.pdf`);
      solverMessage = uiText.messages.pdfDownloaded;
    } catch (error) {
      solverMessage = error instanceof Error ? error.message : uiText.errors.failedExportPdf;
    } finally {
      exportBusy = false;
    }
  }

  async function loadBootstrap(): Promise<void> {
    loadingBootstrap = true;
    catalogError = null;

    try {
      const bootstrap = await getCalculatorBootstrapCached(8, 12);
      bootstrapSolutions = bootstrap.solutions;
      bootstrapFertilizers = bootstrap.fertilizers;

      if (selectedSolutionId === null && bootstrapSolutions[0]) {
        selectedSolutionId = bootstrapSolutions[0].id;
        targetElements = solutionElementsFromRpcSolution(bootstrapSolutions[0]);
      }

      if (selectedFertilizers.length === 0 && activeCalculationId === null) {
        const defaultDoses = [0.72, 0.34, 0.28];
        selectedFertilizers = bootstrapFertilizers.slice(0, 3).map((fertilizer, index) => ({
          fertilizerId: fertilizer.id,
          gramsPerLiter: defaultDoses[index] ?? suggestedDoseFor(fertilizer.id),
        }));
      }

      if (selectedFertilizers.length > 0) {
        queueMicrotask(() => solveSelectedDoses());
      }
    } catch (error) {
      catalogError = error instanceof Error ? error.message : uiText.errors.failedBootstrap;
      solverMessage = uiText.messages.catalogLoadFailed;
    } finally {
      loadingBootstrap = false;
    }
  }

  async function searchSolutions(reset: boolean): Promise<void> {
    const query = solutionSearch.trim();
    if (!query) {
      solutionSearchResults = [];
      nextSolutionCursor = null;
      return;
    }

    const requestId = ++solutionRequestToken;
    if (reset) {
      loadingSolutionSearch = true;
    } else {
      loadingMoreSolutions = true;
    }

    try {
      const page = await listSolutionsPageCached(query, "", reset ? "" : (nextSolutionCursor ?? ""), 12);
      if (requestId !== solutionRequestToken) {
        return;
      }

      const items = page.items;
      solutionSearchResults = reset ? items : dedupeById([...solutionSearchResults, ...items]);
      nextSolutionCursor = page.nextCursor;
    } catch (error) {
      if (requestId !== solutionRequestToken) {
        return;
      }
      catalogError = error instanceof Error ? error.message : uiText.errors.failedSearchSolutions;
    } finally {
      if (requestId === solutionRequestToken) {
        loadingSolutionSearch = false;
        loadingMoreSolutions = false;
      }
    }
  }

  async function searchFertilizers(reset: boolean): Promise<void> {
    const query = fertilizerSearch.trim();
    if (!query) {
      fertilizerSearchResults = [];
      nextFertilizerCursor = null;
      return;
    }

    const requestId = ++fertilizerRequestToken;
    if (reset) {
      loadingFertilizerSearch = true;
    } else {
      loadingMoreFertilizers = true;
    }

    try {
      const page = await listFertilizersPageCached(query, reset ? "" : (nextFertilizerCursor ?? ""), 24);
      if (requestId !== fertilizerRequestToken) {
        return;
      }

      const items = page.items;
      fertilizerSearchResults = reset ? items : dedupeById([...fertilizerSearchResults, ...items]);
      nextFertilizerCursor = page.nextCursor;
    } catch (error) {
      if (requestId !== fertilizerRequestToken) {
        return;
      }
      catalogError = error instanceof Error ? error.message : uiText.errors.failedSearchFertilizers;
    } finally {
      if (requestId === fertilizerRequestToken) {
        loadingFertilizerSearch = false;
        loadingMoreFertilizers = false;
      }
    }
  }

  function dedupeById<T extends { id: number }>(items: T[]): T[] {
    const seen = new Set<number>();
    const result: T[] = [];

    for (const item of items) {
      if (seen.has(item.id)) {
        continue;
      }
      seen.add(item.id);
      result.push(item);
    }

    return result;
  }
</script>

<section class="space-y-5">
  <div class="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
    <div class="max-w-3xl">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{uiText.heroEyebrow}</p>
      <h2 class="mt-2 text-2xl font-semibold text-white sm:text-3xl">{uiText.heroTitle}</h2>
      <p class="mt-3 text-sm leading-6 text-ocean-100/80">{uiText.heroBody}</p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      <div class="rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.22em] text-ocean-300/70">{uiText.summaryTargetNh4}</p>
        <p class="mt-2 text-2xl font-semibold text-white">{targetRatio.nh4Percent.toFixed(1)}</p>
      </div>
      <div class="rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.22em] text-ocean-300/70">{uiText.summaryMixNh4}</p>
        <p class="mt-2 text-2xl font-semibold text-white">{mixRatio.nh4Percent.toFixed(1)}</p>
      </div>
      <div class="rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.22em] text-ocean-300/70">{uiText.summaryMixEc}</p>
        <p class="mt-2 text-2xl font-semibold text-white">{estimatedEc.toFixed(2)}</p>
      </div>
      <div class="rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.22em] text-ocean-300/70">{uiText.summaryResidual}</p>
        <p class="mt-2 text-2xl font-semibold text-white">{solverResidual.toFixed(1)}</p>
      </div>
    </div>
  </div>

  <div class="grid gap-4 2xl:grid-cols-[minmax(19rem,24rem)_minmax(0,1fr)] 2xl:items-start">
    <aside class="space-y-4">
      <section class="rounded-[1.75rem] border border-white/10 bg-black/12 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{uiText.calculations}</p>
        <label class="mt-4 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-200/75">
          {uiText.calculationName}
          <input bind:value={calculationName} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-normal tracking-normal text-white outline-none focus:border-ocean-300" placeholder={uiText.calculationNamePlaceholder} />
        </label>
        <label class="mt-4 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-200/75">
          {uiText.savedCalculations}
          <select value={activeCalculationSelectValue} onchange={(event) => handleCalculationSelection((event.currentTarget as HTMLSelectElement).value)} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-normal tracking-normal text-white outline-none focus:border-ocean-300" disabled={loadingCalculations}>
            <option value="">{currentUser ? uiText.unsavedDraft : uiText.guestDraft}</option>
            {#each savedCalculations as calculation}
              <option value={calculation.id}>{calculation.name}</option>
            {/each}
          </select>
        </label>
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10" onclick={resetDraftCalculation}>{uiText.newAction}</button>
          <button type="button" class="touch-target rounded-2xl bg-sand-200 px-4 text-sm font-semibold text-ocean-950 transition hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60" onclick={() => void saveCalculation()} disabled={!currentUser || savingCalculation || loadingCalculations}>{savingCalculation ? uiText.savingAction : uiText.saveAction}</button>
          <button type="button" class="touch-target rounded-2xl border border-rose-200/20 bg-rose-950/20 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-950/30 disabled:cursor-not-allowed disabled:opacity-60" onclick={() => void deleteCalculation()} disabled={!currentUser || activeCalculationId === null || deletingCalculation || loadingCalculations}>{deletingCalculation ? uiText.deletingAction : uiText.deleteAction}</button>
        </div>
        <div class="mt-3 space-y-2 text-sm">
          {#if loadingCalculations}
            <p class="text-ocean-100/70">{uiText.loadingCalculations}</p>
          {:else if !currentUser}
            <p class="text-ocean-100/70">{uiText.guestReadonlyHint}</p>
          {/if}
          {#if calculationMessage}
            <p class="text-ocean-100/80">{calculationMessage}</p>
          {/if}
          {#if calculationError}
            <p class="text-rose-200">{calculationError}</p>
          {/if}
        </div>
      </section>

      <section class="rounded-[1.75rem] border border-white/10 bg-black/12 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{uiText.targetRecipe}</p>
        <label class="mt-4 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-200/75">
          {uiText.searchSolutions}
          <input bind:value={solutionSearch} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-normal tracking-normal text-white outline-none focus:border-ocean-300" placeholder={uiText.searchSolutionsPlaceholder} />
        </label>
        <label class="mt-4 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-200/75">
          {uiText.solutionPreset}
          <select value={selectedSolutionId ?? ""} onchange={(event) => {
            const value = (event.currentTarget as HTMLSelectElement).value;
            if (!value) {
              selectedSolutionId = null;
              return;
            }
            setSelectedSolution(Number(value));
          }} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-normal tracking-normal text-white outline-none focus:border-ocean-300" disabled={loadingBootstrap || solutionSelectOptions.length === 0}>
            {#if solutionSelectOptions.length === 0}
              <option value="">{loadingBootstrap ? uiText.loadingSolutions : uiText.noSolutionsFound}</option>
            {/if}
            {#if selectedSolutionId === null && solutionSelectOptions.length > 0}
              <option value="">{uiText.customTarget}</option>
            {/if}
            {#each solutionSelectOptions as solution}
              <option value={solution.id}>{solution.name}</option>
            {/each}
          </select>
        </label>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-ocean-100/70">
          <span class="rounded-full bg-black/20 px-3 py-1.5">{solutionSearch.trim().length > 0 ? uiText.searchMode : uiText.defaultsMode}</span>
          {#if loadingSolutionSearch}
            <span class="rounded-full bg-black/20 px-3 py-1.5">{uiText.searching}</span>
          {/if}
        </div>
        {#if solutionSearch.trim().length > 0}
          <div class="mt-3">
            <button type="button" class="touch-target w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60" onclick={() => void searchSolutions(false)} disabled={!nextSolutionCursor || loadingMoreSolutions}>
              {loadingMoreSolutions ? uiText.loadingMoreSolutions : nextSolutionCursor ? uiText.loadMoreSolutionMatches : uiText.noMoreSolutionMatches}
            </button>
          </div>
        {/if}
        <label class="mt-3 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-200/75">
          {uiText.tankVolume}
          <input bind:value={volumeLiters} type="number" min="1" step="1" class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-normal tracking-normal text-white outline-none focus:border-ocean-300" />
        </label>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
          {#each featuredElements as key}
            <div class="rounded-3xl bg-black/18 px-4 py-3">
              <p class="text-xs uppercase tracking-[0.18em] text-ocean-300/70">{key}</p>
              <p class="mt-2 text-lg font-semibold text-white">{formatPpm(targetElements[key] ?? 0)} {uiText.ppmSuffix}</p>
            </div>
          {/each}
        </div>

        <details class="mt-4 rounded-3xl border border-white/10 bg-black/14 px-4 py-3 text-ocean-100/78">
          <summary class="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.2em] text-ocean-300/80">
            {uiText.secondaryMicronutrients}
          </summary>
          <div class="mt-3 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            {#each traceElements as key}
              <div class="rounded-3xl bg-black/18 px-4 py-3">
                <p class="text-xs uppercase tracking-[0.18em] text-ocean-300/70">{key}</p>
                <p class="mt-2 text-lg font-semibold text-white">{formatPpm(targetElements[key] ?? 0)} {uiText.ppmSuffix}</p>
              </div>
            {/each}
          </div>
        </details>
      </section>

    </aside>

    <div class="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(24rem,1fr)] 2xl:items-start">
      <section class="rounded-[1.75rem] border border-white/10 bg-black/12 p-5 sm:p-6 2xl:flex 2xl:max-h-[calc(100vh-10rem)] 2xl:flex-col">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{uiText.fertilizers}</p>
            <p class="mt-2 text-sm leading-6 text-ocean-100/75">{uiText.fertilizersBody}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="rounded-3xl bg-black/20 px-4 py-3 text-sm text-ocean-100/80">{uiText.inputsActive(selectedFertilizerRows.length)}</div>
            <button type="button" class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60" onclick={() => void savePdf()} disabled={selectedFertilizerRows.length === 0 || exportBusy}>{exportBusy ? uiText.savingPdf : uiText.savePdf}</button>
            <button type="button" class="touch-target rounded-2xl bg-sand-200 px-4 text-sm font-semibold text-ocean-950 transition hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60" onclick={solveSelectedDoses} disabled={selectedFertilizerRows.length === 0}>{uiText.autoSolve}</button>
          </div>
        </div>

        <label class="mt-4 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-200/75">
          {uiText.searchFertilizers}
          <input bind:value={fertilizerSearch} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-normal tracking-normal text-white outline-none focus:border-ocean-300" placeholder={uiText.searchFertilizersPlaceholder} />
        </label>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-ocean-100/70">
          <span class="rounded-full bg-black/20 px-3 py-1.5">{fertilizerSearch.trim().length > 0 ? uiText.searchResults : uiText.defaultsMode}</span>
          {#if loadingFertilizerSearch}
            <span class="rounded-full bg-black/20 px-3 py-1.5">{uiText.searching}</span>
          {/if}
        </div>

        <div class="mt-4 space-y-3 2xl:min-h-0 2xl:flex-1 2xl:overflow-y-auto 2xl:pr-1">
          {#if solverMessage}
            <div class="rounded-3xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-ocean-100/80">{solverMessage}</div>
          {/if}

          {#if catalogError}
            <div class="rounded-3xl border border-rose-200/20 bg-rose-950/20 px-4 py-3 text-sm text-rose-100">{catalogError}</div>
          {/if}

          {#if combinedFertilizerList.selected.length === 0 && combinedFertilizerList.remaining.length === 0}
            <div class="rounded-[1.4rem] border border-white/10 bg-black/18 px-4 py-5 text-sm text-ocean-100/70">{uiText.noFertilizersMatch}</div>
          {/if}

          {#each combinedFertilizerList.selected as row}
            <div class={`grid gap-3 rounded-[1.4rem] border p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_8rem_auto] xl:items-end ${selectedBottleCardClass(row.fertilizerCard.bottle, row.fertilizer.formula)}`}>
              <div class="min-w-0 sm:col-span-2 xl:col-span-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="wrap-break-word font-semibold text-white">{row.fertilizer.name}</p>
                  <span class={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${bottleBadgeClass(row.fertilizerCard.bottle)}`}>{bottleLabel(row.fertilizerCard.bottle)}</span>
                  <span class="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ocean-100/75">{uiText.selected}</span>
                </div>
                <p class="mt-1 wrap-break-word text-xs uppercase tracking-[0.16em] text-ocean-200/60">{row.fertilizer.userName} • {calculatorMode === "auto" ? uiText.engineMode : uiText.manualMode}</p>
              </div>
              <label class="min-w-0 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ocean-200/70">
                {uiText.gramsPerLiter}
                <input type="number" min="0" step="0.01" value={row.gramsPerLiter} class="touch-target rounded-2xl border border-white/10 bg-black/20 px-4 text-sm font-normal tracking-normal text-white outline-none focus:border-ocean-300" oninput={(event) => updateDose(row.fertilizer.id, (event.currentTarget as HTMLInputElement).value)} />
              </label>
              <div class="flex items-end justify-end xl:justify-start">
                <button type="button" class="touch-target rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10" onclick={() => unselectFertilizer(row.fertilizer.id)}>{uiText.unselect}</button>
              </div>
              <div class="min-w-0 rounded-2xl bg-black/20 px-4 py-3 text-sm text-ocean-100/80">
                <p class="text-xs uppercase tracking-[0.16em] text-ocean-200/60">{uiText.tankMass}</p>
                <p class="mt-1 font-semibold text-white">{formatMass(row.totalGrams)} {uiText.massUnit}</p>
              </div>
              <div class="min-w-0 rounded-2xl bg-black/20 px-4 py-3 text-sm text-ocean-100/80">
                <p class="text-xs uppercase tracking-[0.16em] text-ocean-200/60">{uiText.cost}</p>
                <p class="mt-1 font-semibold text-white">{formatMoney(row.estimatedCost)}</p>
              </div>
            </div>
          {/each}

          {#each combinedFertilizerList.remaining as fertilizer}
            <button type="button" class={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition ${remainingBottleCardClass(fertilizer.bottle, fertilizer.formula)}`} onclick={() => toggleFertilizer(fertilizer.id)}>
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-white">{fertilizer.name}</p>
                  <p class="mt-1 text-xs uppercase tracking-[0.16em] text-ocean-200/60">{fertilizer.userName}</p>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span class={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${bottleBadgeClass(fertilizer.bottle)}`}>{bottleLabel(fertilizer.bottle)}</span>
                  <span class="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ocean-100/75">{formatMoney(fertilizer.cost)}</span>
                </div>
              </div>
            </button>
          {/each}

          {#if fertilizerSearch.trim().length > 0}
            <div>
              <button type="button" class="touch-target w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60" onclick={() => void searchFertilizers(false)} disabled={!nextFertilizerCursor || loadingMoreFertilizers}>
                {loadingMoreFertilizers ? uiText.loadingMoreFertilizers : nextFertilizerCursor ? uiText.loadMoreFertilizerMatches : uiText.noMoreFertilizerMatches}
              </button>
            </div>
          {/if}
        </div>
      </section>

      <section class="rounded-[1.75rem] border border-white/10 bg-black/12 p-5 sm:p-6 2xl:sticky 2xl:top-6">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{uiText.targetVsMix}</p>
            <p class="mt-2 text-sm leading-6 text-ocean-100/75">{uiText.targetVsMixBody}</p>
          </div>
          <div class="rounded-3xl bg-black/20 px-4 py-3 text-sm text-ocean-100/80">{uiText.targetEcLabel} {targetEc.ec.toFixed(2)} • {uiText.mixEcLabel} {mixEc.ec.toFixed(2)} • {uiText.nkLabel} {formatRatio(mixRatio.nk)}</div>
        </div>

        <div class="mt-4 overflow-auto 2xl:max-h-[52vh]">
          <table class="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr class="text-left text-xs uppercase tracking-[0.18em] text-ocean-200/60">
                <th class="px-3 py-2">{uiText.element}</th>
                <th class="px-3 py-2">{uiText.target}</th>
                <th class="px-3 py-2">{uiText.mix}</th>
                <th class="px-3 py-2">{uiText.delta}</th>
              </tr>
            </thead>
            <tbody>
              {#each mixMetrics as metric}
                <tr class="rounded-2xl bg-black/18 text-ocean-100/80">
                  <td class="rounded-l-2xl px-3 py-3 font-semibold text-white">{metric.label}</td>
                  <td class="px-3 py-3">{formatPpm(metric.target)}</td>
                  <td class="px-3 py-3">{formatPpm(metric.mixed)}</td>
                  <td class={`rounded-r-2xl px-3 py-3 font-semibold ${metricTone(metric.delta)}`}>{metric.delta >= 0 ? '+' : ''}{formatPpm(metric.delta)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-3xl bg-black/18 px-4 py-4">
            <p class="text-xs uppercase tracking-[0.18em] text-ocean-300/70">{uiText.totalTarget}</p>
            <p class="mt-2 text-2xl font-semibold text-white">{formatPpm(targetTotal)}</p>
          </div>
          <div class="rounded-3xl bg-black/18 px-4 py-4">
            <p class="text-xs uppercase tracking-[0.18em] text-ocean-300/70">{uiText.totalMixed}</p>
            <p class="mt-2 text-2xl font-semibold text-white">{formatPpm(mixedTotal)}</p>
          </div>
          <div class="rounded-3xl bg-black/18 px-4 py-4">
            <p class="text-xs uppercase tracking-[0.18em] text-ocean-300/70">{uiText.delta}</p>
            <p class={`mt-2 text-2xl font-semibold ${metricTone(mixedTotal - targetTotal)}`}>{mixedTotal - targetTotal >= 0 ? '+' : ''}{formatPpm(mixedTotal - targetTotal)}</p>
          </div>
        </div>
      </section>
    </div>
  </div>

  <section class="hidden rounded-[1.75rem] border border-white/10 bg-black/12 p-5 sm:p-6 md:block">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-ocean-300">{uiText.solutionMatrix}</p>
        <p class="mt-2 text-sm leading-6 text-ocean-100/75">{uiText.solutionMatrixBody}</p>
      </div>
      <label class="flex items-center gap-3 rounded-3xl bg-black/20 px-4 py-3 text-sm text-ocean-100/80">
        <span class="text-xs font-semibold uppercase tracking-[0.18em] text-ocean-200/70">{uiText.editMass}</span>
        <input bind:checked={matrixEditMode} type="checkbox" class="h-4 w-4 accent-sand-200" />
      </label>
    </div>

    {#if matrixRows.length === 0}
      <div class="mt-4 rounded-[1.4rem] border border-white/10 bg-black/18 px-4 py-5 text-sm text-ocean-100/70">{uiText.emptyMatrix}</div>
    {:else}
      <div class="mt-4 overflow-auto rounded-[1.4rem] border border-white/10 bg-black/12">
        <table class="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr class="bg-white/6 text-left text-xs uppercase tracking-[0.18em] text-ocean-200/70">
              <th class="sticky left-0 z-10 border-b border-white/10 bg-white/6 px-3 py-3">{uiText.fertilizerColumn}</th>
              {#each elementOrder as key}
                <th class="border-b border-white/10 px-3 py-3 text-right">{key === "NO3" ? "N-NO3" : key === "NH4" ? "N-NH4" : key}</th>
              {/each}
              <th class="border-b border-white/10 px-3 py-3 text-right">{uiText.massColumn}</th>
            </tr>
          </thead>
          <tbody>
            {#each matrixRows as row}
              <tr class="text-ocean-100/80 even:bg-white/4">
                <td class="sticky left-0 z-10 border-b border-white/10 bg-ocean-900 px-3 py-3 font-semibold text-white">{row.name}</td>
                {#each elementOrder as key}
                  <td class="border-b border-white/10 px-3 py-3 text-right tabular-nums">{formatMatrixContribution(row.contributions[key])}</td>
                {/each}
                <td class="border-b border-white/10 px-3 py-2 text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.totalGrams.toFixed(2)}
                    class="w-28 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-right text-sm text-white outline-none focus:border-ocean-300 disabled:opacity-70"
                    readonly={!matrixEditMode}
                    oninput={(event) => updateMass(row.id, (event.currentTarget as HTMLInputElement).value)}
                  />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</section>
