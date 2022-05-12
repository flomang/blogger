<script>
  import { goto } from '$app/navigation';
  import Textfield from "@smui/textfield";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Icon from "@smui/textfield/icon";
  import Button, { Label } from "@smui/button";
  import { user } from '../../stores';

  let email = "";
  let password = "";
  let remember = false;
  let unauthorized = false;
  let disableSubmit = false;

  let handleInput = () => {
    unauthorized = false;
  };

  async function submit(event) {
    let creds = { email: email, password: password, remember: remember };

    // TODO move these hardcoded values to config file
    // TODO implement remember me
    await fetch(import.meta.env.VITE_LOGIN, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Origin": import.meta.env.VITE_ORIGIN,
      },
    })
      .then((response) => response.json())
      .then((json) => {

        if (json == "Unauthorized") {
          unauthorized = true;
        }
        // write json blob to user store
        user.set(json);
        console.log(json);
        goto("/chat");
      });
  }
</script>

<svelte:head>
  <title>Sign in • crypto-fish</title>
</svelte:head>

<div class="content">
  <h1 class="text-xs-center">Sign In</h1>
  <p class="text-xs-center">
    <a href="/signup">Need an account?</a>
  </p>

  <div class="margins">
    <Textfield
      invalid={unauthorized}
      variant="outlined"
      bind:value={email}
      on:keyup={handleInput}
      label="email"
      type="email"
    >
      <Icon class="material-icons" slot="leadingIcon">email</Icon>
    </Textfield>
  </div>
  <div class="margins">
    <Textfield
      invalid={unauthorized}
      variant="outlined"
      bind:value={password}
      on:keyup={handleInput}
      label="password"
      type="password"
    >
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
        disabled={!email || !password || unauthorized}
        on:click={submit}
        variant="raised"
      >
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
