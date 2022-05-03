<script>
  import Textfield from "@smui/textfield";
  import Button, { Label } from "@smui/button";
  import Icon from "@smui/textfield/icon";

  //const { session } = stores();

  let email = "";
  let password = "";
  let emailLabel = "email";
  let invalidEmail = false;

  let handleEmail = () => {
    emailLabel = "email";
    invalidEmail = true;
  };

  async function submit(event) {
    let creds = { email: email, password: password };
    console.log(creds);
    //try {
    //  let response = await mutate(wsClient($session), {
    //    mutation: SIGN_UP,
    //    variables: { username: username, email: email, password: password }
    //  });

    //  if (response.data && response.data.signin) {
    //    const signup = response.data.signup;

    //    // update client session
    //    $session.user = response.data.signup.user;
    //  }

    //  // TODO redirect to verify email
    //  goto("/messages");
    //} catch (error) {
    //  const msg = error.message;
    //  switch (true) {
    //    case msg.includes("users_username_key"):
    //      console.log("yep");
    //      invalidUsername = true;
    //      usernameLabel = "username taken";
    //      break;
    //    case msg.includes("users_email_key"):
    //      invalidEmail = true;
    //      emailLabel = "email already registered";
    //      break;
    //    default:
    //      console.log(response.message);
    //  }
    //  // TODO
    //}
  }
</script>

<svelte:head>
  <title>Sign up • joos</title>
</svelte:head>

<div class="content" >
  <h1 class="text-xs-center">Sign up</h1>
  <p class="text-xs-center">
    <a href="/signin">Have an account?</a>
  </p>

  <div class="margins">
    <Textfield
      variant="filled"
      bind:value={email}
      label={emailLabel}
      invalid={invalidEmail}
      withLeadingIcon
      on:keyup={handleEmail}
      type="email"
    >
      <Icon class="material-icons" slot="leadingIcon">email</Icon>
    </Textfield>
  </div>

  <div class="margins">
    <Textfield
      variant="filled"
      bind:value={password}
      type="password"
      label="password"
    >
      <Icon class="material-icons" slot="leadingIcon">lock</Icon>
    </Textfield>
  </div>
  <Button
    action="submit"
    disabled={!email || !password}
    on:click={submit}
    variant="raised"
  >
    <Label>sign up</Label>
  </Button>
</div>

<style>
  .content {
    width: 300px;
    text-align: center;
    margin: 0 auto;
  }
  .margins {
    margin: 5px 0px 3px;
  }
</style>
