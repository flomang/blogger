<script>
  import Textfield from "@smui/textfield";
  import Button, { Label } from "@smui/button";
  import Icon from '@smui/textfield/icon';

  //const { session } = stores();

  let username = "";
  let email = "";
  let password = "";
  let usernameLabel = "username";
  let emailLabel = "email";
  let invalidUsername = false;
  let invalidEmail = false;

  let handleUsername = () => {
    usernameLabel = "username";
    invalidUsername = false;
  };
  let handleEmail = () => {
    emailLabel = "email";
    invalidEmail = false;
  };

  async function submit(event) {
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

<style>
  .content {
    width: 300px;
    background-color: rgb(22, 22, 22);
    color: #fff;
    text-align: center;
    margin: 0 auto;
  }
  .margins {
    margin: 5px 0px 3px;
  }
</style>

<svelte:head>
  <title>Sign up • joos</title>
</svelte:head>

<div class="content">
  <h1 class="text-xs-center">Sign up</h1>
  <p class="text-xs-center">
    <a href="/signin">Have an account?</a>
  </p>

  <div class="margins">
    <Textfield
      invalid={invalidUsername}
      withLeadingIcon
      variant="filled"
      bind:value={username}
      on:keyup={handleUsername}
      label={usernameLabel}>
      <Icon class="material-icons">face</Icon>
    </Textfield>
  </div>

  <div class="margins">
    <Textfield
      invalid={invalidEmail}
      withLeadingIcon
      variant="filled"
      bind:value={email}
      on:keyup={handleEmail}
      label={emailLabel}
      type="email">
      <Icon class="material-icons">email</Icon>
    </Textfield>
  </div>

  <div class="margins">
    <Textfield
      withLeadingIcon
      variant="filled"
      bind:value={password}
      type="password"
      label="password"
      input$aria-controls="helper-text-fullwidth-textarea"
      input$aria-describedby="helper-text-fullwidth-textarea">
      <Icon class="material-icons">lock</Icon>
    </Textfield>
  </div>
  <Button
    action="submit"
    disabled={!username || !email || !password}
    on:click={submit}
    variant="raised">
    <Label>sign up</Label>
  </Button>
</div>
