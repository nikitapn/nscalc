<script lang="ts">
  import type { Component } from "svelte";
  import { onMount, tick } from "svelte";

  let { card, items, start = $bindable(0), end = $bindable(0) } = $props();

  let heightMap = $state([]);
  let rows: any[] = [];
  let viewport: Element | undefined = $state();
  let contents: any = $state();
  let viewportHeight = $state<number>(0);
  let mounted = $state(false);
  let top = $state(0);
  let bottom = $state(0);
  let averageHeight = $state();

  const visible = $derived(
    items.slice(start, end).map((data: any, i: number) => {
      return { index: i + start, data };
    }),
  );

  $effect(
    () =>
      mounted && items && setTimeout(() => refresh(items, viewportHeight), 0),
  );

  async function refresh(items: any, viewportHeight: number) {
    rows = contents.getElementsByTagName("virtual-list-row");
    // console.log("rows.length = " + rows.length + ", viewportHeight = " + viewportHeight);
    const { scrollTop } = viewport!;

    let contentHeight = top - scrollTop;
    let i = start;
    let lastItemTop = 0;

    while (contentHeight < viewportHeight && i < items.length) {
      let row = rows[i - start];

      if (!row) {
        end = i + 1;
        await tick(); // render the newly visible row
        row = rows[i - start];
      }

      const rowHeight = (heightMap[i] = row.offsetHeight);
      // console.log({rowHeight});

      if (lastItemTop !== row.offsetTop) {
        lastItemTop = row.offsetTop;
        contentHeight += rowHeight;
      }

      i += 1;
    }

    end = i + 1;

    const remaining = items.length - end;
    averageHeight = (top + contentHeight) / end;

    bottom = remaining * averageHeight;
    heightMap.length = items.length;
  }

  async function handleScroll() {
    const { scrollTop } = viewport!;

    console.log({ scrollTop, rl: rows.length, a: rows[0].offsetHeight });

    const old_start = start;

    for (let v = 0; v < rows.length; v += 1) {
      heightMap[start + v] = rows[v].offsetHeight;
    }

    let i = 0;
    let y = 0;

    while (i < items.length) {
      const row_height = heightMap[i] || averageHeight;
      if (y + row_height > scrollTop) {
        start = i;
        top = y;

        break;
      }

      y += row_height;
      i += 1;
    }

    while (i < items.length) {
      y += heightMap[i] || averageHeight;
      i += 1;

      if (y > scrollTop + viewportHeight) break;
    }

    end = i;

    const remaining = items.length - end;
    averageHeight = y / end;

    while (i < items.length) heightMap[i++] = averageHeight;
    bottom = remaining * averageHeight;

    // prevent jumping if we scrolled up into unknown territory
    /*
    if (start < old_start) {
			await tick();

			let expected_height = 0;
			let actual_height = 0;

			for (let i = start; i < old_start; i +=1) {
				if (rows[i - start]) {
					expected_height += heightMap[i];
					actual_height += rows[i - start].offsetHeight;
				}
			}

			// const d = actual_height - expected_height;
			// viewport.scrollTo(0, scrollTop + d);
			}
*/
  }

  // trigger initial refresh
  onMount(() => {
    mounted = true;
  });
</script>

<virtual-list-viewport
  bind:this={viewport}
  bind:offsetHeight={viewportHeight}
  on:scroll={handleScroll}
>
  <virtual-list-contents
    bind:this={contents}
    style="padding-top: {top}px; padding-bottom: {bottom}px;"
  >
    {#each visible as row (row.index)}
      <virtual-list-row>
        {@render card(row.data.name)}
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
