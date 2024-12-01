

<script lang="ts">
  import { tabs, activeTab, addTab, removeTab, setActiveTab } from './TabStore';
  import TabContentA from './TabContentA.svelte';
  import TabContentB from './TabContentB.svelte';

  addTab("Tab 1", TabContentA, { data: "Data for Tab 1" })
</script>

<style>
  .tab-bar {
    display: flex;
    border-bottom: 1px solid #ccc;
  }
  .tab {
    padding: 10px 15px;
    cursor: pointer;
    position: relative;
    border: 1px solid transparent;
    border-bottom: none;
    background: #f0f0f0;
  }
  .tab.active {
    background: #fff;
    border-color: #ccc;
    font-weight: bold;
  }
  .tab .close {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }
  .tab-content {
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>

<div class="tab-bar">
  {#each $tabs as tab}
    <div
      class="tab {tab.id === $activeTab ? 'active' : ''}"
      on:click={() => setActiveTab(tab.id)}
    >
      {tab.title}
      <span class="close" on:click={() => removeTab(tab.id)}>&times;</span>
    </div>
  {/each}
  <button on:click={() => addTab("New Tab", TabContentA, { data: "Dynamic Data" })}>
    + Add Tab
  </button>
</div>

<div class="tab-content">
  {#if $activeTab}
    {#each $tabs as tab (tab.id)}
      {#if tab.id === $activeTab}
        <svelte:component this={tab.component} {...tab.props} />
      {/if}
    {/each}
  {:else}
    <div>Please select a tab</div>
  {/if}
</div>
