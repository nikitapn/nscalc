{#snippet elem(name, value)}
<div class="field">
  <label>{name}</label>
  <input value={value} />
</div>
{/snippet}

{#snippet readonly(name, value)}
<div class="field">
  <label>{name}</label>
  <span class="out">{value}</span>
</div>
{/snippet}

<div class="sheet">
  <div class="title">
    <div>{name}</div>
  </div>
  <div class="content">
  <div class="elbox">
    {@render elem("N-NO3", 121)}
    {@render elem("N-NH4", 2)}
    {@render elem("P", 32)}
    {@render elem("K", 180)}
    {@render elem("Ca", 16)}
    {@render elem("Mg", 16)}
    {@render elem("S", 16)}
    {@render elem("Cl", 16)}
    {@render elem("Fe", 16)}
    {@render elem("Zn", 16)}
    {@render elem("B", 16)}
    {@render elem("Mn", 16)}
    {@render elem("Cu", 16)}
    {@render elem("Mo", 16)}
  </div>
  <div class="right">
    <div/>
    <div class="readonly">
      {@render readonly("NH4%",16)}
      <div class="separator" />
      {@render readonly("N:K", 16)}
      {@render readonly("K:Ca", 16)}
      {@render readonly("K:Mg", 16)}
      {@render readonly("Ca:Mg", 16)}
      <div class="separator" />
      {@render readonly("Δ", -0.1)}
      {@render readonly("EC", 2.0)}
    </div>
    <div/>
  </div>
  </div>
</div>
<style lang="scss">
  .sheet {
    max-width: 16rem;
    padding: 1rem;
    box-shadow: 0px 3px 3px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
  }
  .title {
    padding: 3px;
    border-bottom: 1px solid;
    margin-bottom: 3px;
  }
  .content {
    display: flex;
    justify-content: space-between;
    gap: 6px
  }
  .elbox {
    display: flex;
    flex-direction: column;
    background-color: #ac00cc0c;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .readonly {
    background-color: #accccc9c; 
  }
  .separator {
    border-bottom: 1px solid #ccffac;
    margin: 5px 10px 5px 10px;
  }
  .field {
    display: flex;
    align-items: center;
    padding: 3px;
    justify-content: space-between;
  }
  .out {
    width: 2rem;
    text-align: center;
    color: white;
  }
  input {
    @extend .out;
    width: 2rem;
    background-color: rgb(0,0,0,0);
    border: none;
    text-align: center;
  }
  input:focus {
    outline: none;
    background-color: #cccccccc;
  }
  label {
    text-align: center;
    width: 4rem;
  }
</style>

<script lang="ts">
  const { name, owner } = $props();
</script>


