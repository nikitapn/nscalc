<script lang="ts">
    import Solution from "./Solution.svelte";
    import Virtual from "./Virtual.svelte";

    let start = $state(0);
    let end = $state(0);

    const things = $state(
        new Array(100).fill({}).map((unused, key) => {
            return { name: `Solution #${key}` };
        }),
    );

    const mac = () => Math.round(240 * Math.random());
    const mic = () => (4 * Math.random()).toFixed(2);
</script>

<div class="main">
    <Virtual items={things} bind:start bind:end>
        {#snippet card(text)}
            <Solution name={text} owner="superuser" />
        {/snippet}
    </Virtual>
</div>

<p>showing {start + 1}-{end} of {things.length} rows</p>

<style lang="scss">
    @import "@/styles/variables";
    .main {
        //display: grid;
        //grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
        //align-items: center;
        //flex-direction: column;
        padding: 1rem;
        //justify-items: center;
        //gap: 16px;
        // height: 1000px;
    }
</style>
