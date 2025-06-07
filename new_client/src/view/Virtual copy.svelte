<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { writable, derived } from "svelte/store";

  export let card: (data: any) => any;
  export let items: any[] = [];

  const start = writable(0);
  const end = writable(0);
  const heightMap = writable<number[]>([]);
  const viewportHeight = writable(0);
  const top = writable(0);
  const bottom = writable(0);
  const averageHeight = writable(50); // Default average height

  let viewport: HTMLElement | null = null;
  let contents: HTMLElement | null = null;

  const visible = derived([start, end], ([$start, $end]) => {
    return items.slice($start, $end).map((data, i) => ({ index: i + $start, data }));
  });

  function refresh() {
    if (!viewport || !contents) return;

    const rows = Array.from(contents.children) as HTMLElement[];
    const scrollTop = viewport.scrollTop;

    let contentHeight = 0;
    let i = 0;
    let lastItemTop = 0;

    while (contentHeight < viewport.offsetHeight && i < items.length) {
      const row = rows[i];
      if (!row) break;

      const rowHeight = row.offsetHeight;
      heightMap.update((map) => {
        map[i] = rowHeight;
        return map;
      });

      if (lastItemTop !== row.offsetTop) {
        lastItemTop = row.offsetTop;
        contentHeight += rowHeight;
      }

      i++;
    }

    end.set(i);

    const remaining = items.length - i;
    averageHeight.set(contentHeight / i || 50);
    bottom.set(remaining * (contentHeight / i || 50));
  }

  function handleScroll() {
    if (!viewport) return;

    const scrollTop = viewport.scrollTop;
    let y = 0;
    let i = 0;

    heightMap.update((map) => {
      while (i < items.length) {
        const rowHeight = map[i] || 50;
        if (y + rowHeight > scrollTop) {
          start.set(i);
          top.set(y);
          break;
        }
        y += rowHeight;
        i++;
      }
      return map;
    });

    refresh();
  }

  onMount(() => {
    refresh();
  });

  afterUpdate(() => {
    refresh();
  });
</script>

<virtual-list-viewport
  bind:this={viewport}
  bind:offsetHeight={$viewportHeight}
  on:scroll={handleScroll}
>
  <virtual-list-contents
    bind:this={contents}
    style="padding-top: {$top}px; padding-bottom: {$bottom}px;"
  >
    {#each $visible as row (row.index)}
      <virtual-list-row>
        {@html card(row.data)}
      </virtual-list-row>
    {/each}
  </virtual-list-contents>
</virtual-list-viewport>

<style lang="scss">
  virtual-list-viewport {
    overflow-y: auto;
    display: block;
    height: 700px;
  }

  virtual-list-contents {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    grid-auto-rows: 1fr;
  }
</style>
