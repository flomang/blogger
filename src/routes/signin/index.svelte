<script>
  //import { goto, stores } from "@sapper/app";
  import ListErrors from "../_components/ListErrors.svelte";
  import Textfield from "@smui/textfield";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Icon from '@smui/textfield/icon';
  import Button, { Label } from "@smui/button";

  //const { session } = stores();
  let email = "";
  let password = "";
  let remember = false;
  let emailLabel = "email";
  let emailInvalid = false;
  let passwordLabel = "password";
  let passwordInvalid = false;
  let disableSubmit = false;

  let handleInput = () => {
    passwordLabel = "password";
    passwordInvalid = false;
    emailLabel = "email";
    emailInvalid = false;
  };

  let valueA = '';

  async function submit(event) {
    let creds =  { email: email, password: password, remember: remember };
    console.log(creds);
    // try {
    //   let response = await mutate(wsClient($session), {
    //     mutation: SIGN_IN,
    //     variables: { email: email, password: password, remember: remember }
    //   });

    //   if (response.data && response.data.signin) {
    //     const signin = response.data.signin;

    //     // post the user and token to the server session
    //     await post(`auth/signin`, { user: signin.user, token: signin.token });

    //     // update client session
    //     $session.user = response.data.signin.user;
    //     $session.token = response.data.signin.token;
    //   }

    //   disableSubmit = true;
    //   setTimeout(function() {
    //     goto("/messages");
    //   }, 2000);
    // } catch (error) {
    //   const msg = error.message;

    //   switch (true) {
    //     case msg.includes("incorrect password/email"):
    //       passwordInvalid = true;
    //       passwordLabel = "you cannot pass!";
    //       emailInvalid = true;
    //       emailLabel = "email/password incorrect";
    //       break;
    //     case msg.includes("email account not verified"):
    //       emailInvalid = true;
    //       emailLabel = "email unverified";
    //       break;
    //     default:
    //       console.log(error);
    //   }
    //   // TODO
    // }
  }
</script>

<style>
  .content {
    width: 300px;
    text-align: center;
    margin: 0 auto;
  }
  .lds-ring {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin: 0 auto;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 30px;
    height: 30px;
    border: 2px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .margins {
    margin: 5px 0px 3px;
  }
</style>

<svelte:head>
  <title>Sign in • crypto-fishing</title>
</svelte:head>

<div class="content">
  <h1 class="text-xs-center">Sign In</h1>
  <p class="text-xs-center">
    <a href="/signup">Need an account?</a>
  </p>

  <div class="margins">
    <Textfield variant="outlined" bind:value={email} label="Leading Icon">
      <Icon class="material-icons" slot="leadingIcon">email</Icon>
    </Textfield>


    <Textfield
      invalid={emailInvalid}
      variant="filled"
      bind:value={email}
      on:keyup={handleInput}
      label={emailLabel}
      type="email">
      <Icon class="material-icons" slot="leadingIcon">email</Icon>
    </Textfield>
  </div>
  <div class="margins">
    <Textfield
      invalid={passwordInvalid}
      variant="filled"
      bind:value={password}
      on:keyup={handleInput}
      label={passwordLabel}
      type="password">
      <Icon class="material-icons" slot="leadingIcon">lock</Icon>
    </Textfield>
  </div>
  <div class="margins">
    <FormField>
      <span slot="label">Remember me.</span>
      <Checkbox bind:checked={remember} />
    </FormField>
  </div>

  {#if !disableSubmit}
    <div>
      <Button
        action="submit"
        disabled={!email || !password || passwordInvalid || emailInvalid}
        on:click={submit}
        variant="raised">
        <Label>sign in</Label>
      </Button>
    </div>
  {:else}
    <div class="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  {/if}
</div>
