<svelte:options accessors/>

<svelte:head>
	<link rel="stylesheet" href="style/svelte-material-ui/bare.css" />
</svelte:head>

<script lang="ts">
  import Banner from 'gui/misc/Banner.svelte'
  import Footer from 'gui/misc/Footer.svelte'
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { init as init_mouse } from 'mouse/main'

  export let content: HTMLDivElement;

  let user_made_a_bad_decision = false;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    init_mouse(canvas);
  });

  
</script>

<style>
  * :global(.margins) {
    margin: 18px 0 24px;
  }

  * :global(.columns) {
    display: flex;
    flex-wrap: wrap;
  }

  * :global(.columns > *) {
    flex-basis: 0;
    min-width:155px;
    margin-right: 12px;
  }
  * :global(.columns > *:last-child) {
    margin-right: 0;
  }

  * :global(.columns .mdc-text-field),
  * :global(.columns .mdc-text-field + .mdc-text-field-helper-line) {
    width: 218px;
  }

  * :global(.columns .status) {
    width: auto;
    word-break: break-all;
    overflow-wrap: break-word;
  }


  * :global(.rows) {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  * :global(.rows > *) {
    flex-basis: 0;
    min-width: 470px;
    min-height: 48px;
    margin-top: 48px;
  }
  
  * :global(.rows > *:last-child) {
    margin-bottom: 0;
  }

  .overflow {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events:none;
    z-index: 100;
  }
</style>

<div>
  <canvas class="overflow" bind:this={canvas} width="800" height="600"></canvas>
  {#if !user_made_a_bad_decision}
  <div transition:fade="{{duration: 5000}}">
    <div bind:this={content} />
    <Footer />
  </div>
  {/if}
  <Banner bind:user_made_a_bad_decision={user_made_a_bad_decision}/>
</div>