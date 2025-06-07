<script lang="ts">
import { onMount } from "svelte";

// Mock data for fertilizers
let fertilizers = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  name: `Fertilizer #${i + 1}`,
  author: i % 2 === 0 ? "User A" : "User B",
  cost: (Math.random() * 100).toFixed(2),
  elements: {
    N: (Math.random() * 10).toFixed(2),
    P: (Math.random() * 5).toFixed(2),
    K: (Math.random() * 15).toFixed(2),
    Ca: (Math.random() * 8).toFixed(2),
    Mg: (Math.random() * 4).toFixed(2),
    S: (Math.random() * 6).toFixed(2),
  },
}));

onMount(() => {
  // Any initialization logic if needed
});
</script>

<div class="fertilizers-container">
  {#each fertilizers as fertilizer (fertilizer.id)}
    <div class="fertilizer-card">
      <div class="header">
        <h3>{fertilizer.name}</h3>
        <p>Author: {fertilizer.author}</p>
      </div>
      <div class="content">
        <p>Cost: ${fertilizer.cost}</p>
        <ul>
          {#each Object.entries(fertilizer.elements) as [key, value]}
            <li>{key}: {value}%</li>
          {/each}
        </ul>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
.fertilizers-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.fertilizer-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 1rem;
}

.header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.content ul li {
  font-size: 0.9rem;
  color: #333;
}
</style>