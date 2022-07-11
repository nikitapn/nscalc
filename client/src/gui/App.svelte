<svelte:options accessors/>

<svelte:head>
	<link rel="stylesheet" href="style/svelte-material-ui/bare.css" />
</svelte:head>

<script lang="ts">
  export let content: HTMLDivElement;
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

</style>

<div>
  <div bind:this={content} />
</div>