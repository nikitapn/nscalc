<script lang="ts">
import Solution from "./Solution.svelte";
import Virtual from "./Virtual.svelte";
import { onMount } from "svelte";

// Mock data for solutions
let solutions = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: `Solution #${i + 1}`,
  author: i % 2 === 0 ? "User A" : "User B",
  elements: {
    NO3: Math.round(Math.random() * 100),
    NH4: Math.round(Math.random() * 10),
    P: Math.round(Math.random() * 50),
    K: Math.round(Math.random() * 200),
    Ca: Math.round(Math.random() * 50),
    Mg: Math.round(Math.random() * 20),
    S: Math.round(Math.random() * 30),
    Cl: Math.round(Math.random() * 10),
    Fe: Math.round(Math.random() * 5),
    Zn: Math.round(Math.random() * 5),
    B: Math.round(Math.random() * 5),
    Mn: Math.round(Math.random() * 5),
    Cu: Math.round(Math.random() * 5),
    Mo: Math.round(Math.random() * 5),
  },
  ratios: {
    NH4Percent: (Math.random() * 10).toFixed(1),
    NK: (Math.random() * 5).toFixed(2),
    KCa: (Math.random() * 5).toFixed(2),
    KMg: (Math.random() * 5).toFixed(2),
    CaMg: (Math.random() * 5).toFixed(2),
    delta: (Math.random() * 2 - 1).toFixed(2),
    EC: (Math.random() * 3).toFixed(2),
  },
}));

let start = 0;
let end = 0;

onMount(() => {
  // Any initialization logic if needed
});
</script>

<div class="solutions-container">
  <Virtual items={solutions} bind:start bind:end let:item>
    <Solution
      name={item.name}
      owner={item.author}
      elements={item.elements}
      ratios={item.ratios}
    />
  </Virtual>
</div>

<p class="summary">Showing {start + 1}-{end} of {solutions.length} solutions</p>

<style lang="scss">
.solutions-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.summary {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}
</style>
