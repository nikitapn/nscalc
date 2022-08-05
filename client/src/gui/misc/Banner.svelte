<svelte:options accessors/>

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { fly } from 'svelte/transition';

  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import { Icon as CommonIcon } from '@smui/common';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import FormField from '@smui/form-field';

  export let user_made_a_bad_decision;

  let status = localStorage.getItem("user");

  const happy_user = () => {
    status = "happy";
    localStorage.setItem("user", status);
  };

  const sad_user = () => {
    localStorage.removeItem("user");
    status = "sad";
    user_made_a_bad_decision = true;
  };

</script>

<style>
.banner {
  /*
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 20%;
    */
    /*overflow: auto;*/
    position: fixed;
    width: 80%;
    left: 10%;
    bottom: 1%;
    z-index: +1;
    border-radius: 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 32px;
    /* box-sizing: border-box; */
    /* transform: scale(0.8); */
    /* bottom: 0; */
    /* margin-top: 1000px; */
    /* pointer-events: none; */
    color: red;
    background-color: rgb(0, 0, 0);
    border: solid red;
    justify-content: space-around;
    font: 28px Verdana;
}

.btn-c {
  display: flex;
  flex-direction: column;
}

.didnotworkout {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: +10;

    display: flex;
    flex-direction: column;
    align-items: center;
    /*padding: 32px;*/
    /* box-sizing: border-box; */
    /* transform: scale(0.8); */
    /* bottom: 0; */
    /* margin-top: 1000px; */
    pointer-events: none;
    color: rgb(53, 228, 68);
    /* background-color: rgb(0, 0, 0); */
    
    /* background-image: url("/../public/img/curtain2"); */
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    justify-content: center;

    font: 36px "Comic Sans MS";
}

</style>

{#if status == null }
<div class="banner" transition:fade="{{duration: 2500}}">
  <div>
    This website uses cookies to ensure you get the best experience on our website.
  </div>
  <div class="btn-c">
    <Button style="margin: 5px" variant="raised" on:click={happy_user}>
      <Label>I understand</Label>
    </Button>
    <Button style="margin: 5px" variant="outlined" color="secondary" on:click={sad_user}>
      <Label>I don't want it</Label>
    </Button>
  </div>
</div>
{/if}

{#if status == "sad" }
<div class="didnotworkout curtain" in:fly="{{delay: 5000, duration: 5000, y: -3000}}">
  <CommonIcon class="material-icons" style="font-size: 5em; line-height: normal; vertical-align: top; color: blue;">call_split</CommonIcon>
  <p>We are very sorry things didn't work out between us.</p>
  <p>Maybe it's our fault.</p>
  <p>Goodbye and Have a nice day!</p>
</div>
{/if}