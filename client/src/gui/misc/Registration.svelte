<svelte:options accessors/>

<script lang="ts">
  import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import { Icon as CommonIcon } from '@smui/common';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import FormField from '@smui/form-field';
  import Checkbox from '@smui/checkbox';
  import { authorizator } from 'rpc/rpc'
	import * as npkcalc from 'rpc/npkcalc'
  import { onMount } from 'svelte';
  import { set_user_data } from 'misc/login'

  let open = false;

  export const activate = () => { open = true; }

  let username = "";
  let email = "";
  let password = "";
  let password_repeated = "";
  let code = "";

  let password_visible = false;
  let step_one = true;
  let invalid_username = false;
  let invalid_email = false;

  $: psw_type = password_visible ? 'text' : 'password';
  $: has_no_errors = 
    !invalid_username &&
    !invalid_email &&
    username.length > 3 && 
    email.length > 3 && 
    password.length >= 6 &&
    password == password_repeated;

  class Checker {
    timeout_id: any = -1;
    toggle() {
      if (this.timeout_id != -1) clearTimeout(this.timeout_id);
      this.timeout_id = setTimeout(() => { this.fn(); this.timeout_id = -1; }, this.delay);
    }
    constructor(public delay: number, public fn: () => any) {}
  }

  let checker_user: Checker;
  let checker_email: Checker;

  onMount(async () => {
    checker_user = new Checker(500, () => { authorizator.CheckUsername(username).then(x => invalid_username = !x) });
    checker_email = new Checker(500, () => { authorizator.CheckEmail(email).then(x => invalid_email = !x) });
	});

  const do_register_step_one = () => {
    authorizator.RegisterStepOne(username, email, password)
    .then(() => { step_one = false; })
    .catch( ( ex: npkcalc.RegistrationFailed ) => {
      console.log(ex);
    }); 
  };

  const do_register_step_two = () => {
    let icode = parseInt(code, 10);
    if (icode < 10000 || icode > 99999) return;

    authorizator.RegisterStepTwo(username, icode)
    .then(() => { 
      open = false; 
      authorizator.LogIn(email, password)
      .then((user_data: npkcalc.UserData) => set_user_data(user_data, true));
    })
    .catch( ( ex: npkcalc.RegistrationFailed ) => {
      console.log(ex);
    });
  };

</script>

<Dialog
  bind:open
  scrimClickAction=""
  escapeKeyAction=""
  aaria-labelledby=""
  aria-describedby=""
>
  <Header style="display: flex;">
    <Title id="fullscreen-title">
      {#if step_one}Create your Hydrosoft Account{:else}
      To verify your account please enter the code<br>that you should see in the alarm bar
      {/if}</Title>
    <IconButton style="margin-left: auto; order: 2;" action="close" class="material-icons">close</IconButton>
  </Header>
  <Content id="fullscreen-content">
    <FormField style="display: flex; flex-direction: column-reverse;">
      <div class="rows">
        {#if step_one}
        <div>
        <Textfield style="width: 95%;" variant="outlined" invalid={invalid_username} bind:value={username} on:input={Checker.prototype.toggle.bind(checker_user)}>
          <svelte:fragment slot="label">
            <CommonIcon
              class="material-icons"
              style="font-size: 1em; line-height: normal; vertical-align: top;"
              >person</CommonIcon
            > Username
          </svelte:fragment>
        </Textfield>
        {#if invalid_username}<HelperText persistent style="margin-left: 16px;" slot="helper">Username is already registered</HelperText>{/if}

        </div>
        <div>
        <Textfield style="width: 95%;" variant="outlined" invalid={invalid_email} bind:value={email} on:input={Checker.prototype.toggle.bind(checker_email)}>
          <svelte:fragment slot="label">
            <CommonIcon
              class="material-icons"
              style="font-size: 1em; line-height: normal; vertical-align: top;"
              >email</CommonIcon
            > Email
          </svelte:fragment>
        </Textfield>
        {#if invalid_email}<HelperText persistent style="margin-left: 16px;" slot="helper">Email is already registered</HelperText>{/if}

        </div>
        <div>
        <div class="columns">
          <Textfield variant="outlined" type={psw_type} bind:value={password}>
            <svelte:fragment slot="label">
              <CommonIcon
                class="material-icons"
                style="font-size: 1em; line-height: normal; vertical-align: top;"
                >password</CommonIcon
              > Password
            </svelte:fragment>
          </Textfield>
          <Textfield variant="outlined" invalid={password != password_repeated} type={psw_type} bind:value={password_repeated}>
            <svelte:fragment slot="label">
              <CommonIcon
                class="material-icons"
                style="font-size: 1em; line-height: normal; vertical-align: top;"
                >password</CommonIcon
              > Repeat
            </svelte:fragment>
          </Textfield>
          <div style="margin-top: 7px;">
            <FormField>
              <Checkbox bind:checked={password_visible} />
              <span slot="label">Show.</span>
            </FormField>
          </div>
        </div>
        {#if password.length > 3 && password.length < 6}<HelperText persistent style="margin-left: 16px;" slot="helper">Password is too short</HelperText>{/if}
      </div>
        <Button disabled={!has_no_errors} on:click={do_register_step_one}>
          <Label>Register</Label>
        </Button>
        {:else}
          <Textfield variant="outlined" bind:value={code} on:input={do_register_step_two} label="Code"  />
          <Button color="secondary" on:click={() => {step_one = true}}>
            <Label>I want to change my credentials!</Label>
          </Button>
        {/if}
      </div>
    </FormField>
  </Content>
</Dialog>