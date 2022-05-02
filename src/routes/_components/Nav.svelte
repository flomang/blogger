<script>
  import IconButton, { Icon } from "@smui/icon-button";
  import { goto, stores } from "@sapper/app";

  const { session } = stores();

  export let segment = null;
</script>

<style>
  nav {
    color: #fff;
    background-color: rgb(9, 9, 9);
    height: 46px;
    padding-left: 20px;
  }

  div {
    font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    height: 46px;
    line-height: 46px;
    font-size: 13px;
    text-align: center;
  }

  .outline {
    margin-top: 3px;
    margin-bottom: 3px;
    height: 40px;
    border-radius: 3px;
  }
  .btc-symbol {
    width: 24px;
    height: 24px;
    position: relative;
    top: 3px;
  }
  .balance {
    position: relative;
    left: -3px;
    top: -3px;
  }
  .available {
    font-size: 1.1em;
    font-weight: bold;
    background-color: rgba(23, 150, 110, 0.4);
  }
  .play {
    font-size: 1.1em;
    font-weight: bold;
    background-color: rgba(255, 0, 0, 0.3);
  }
  .nav-icon {
    margin-right: 9px;
  }
</style>

<nav class={segment} bp="grid 1">
  {#if $session.user}
    <div bp="4">
      <div bp="grid 6">
        <div on:click={() => goto('/space')}>bitkido</div>
      </div>
    </div>
    <div bp="8">
      <div bp="grid 1 gap-none">
        <div
          bp="1@sm 2@md offset-10@sm offset-7@md offset-7@lg"
          class="outline available"
          on:click={() => goto('/balances')}>
          <img class="btc-symbol" alt="" src="btc_symbol.png" />
          <span class="balance">10.1983230</span>
        </div>
        <div
          bp="1@sm 2@md"
          class="outline play"
          on:click={() => goto('/bets')}>
          <img class="btc-symbol" alt="" src="btc_symbol.png" />
          <span class="balance">0.00031233</span>
        </div>
        <div bp="show@xs show@sm hide@md hide@lg">
          <IconButton class="material-icons" on:click={() => goto('/messages')}>
            fastfood
          </IconButton>
        </div>
        <div bp="show@md show@lg hide@sm">
          <IconButton class="material-icons" on:click={() => goto('/messages')}>
            message
          </IconButton>
        </div>
        <div bp="show@md show@lg hide@sm">
          <IconButton class="material-icons" on:click={() => goto('/profile')}>
            person
          </IconButton>
        </div>
      </div>
    </div>
  {:else}
    <div bp="offset-11">
      <div>
        <div on:click={() => goto('/signin')}>sign in</div>
      </div>
    </div>
    <div bp="offset-12">
      <div>
        <div on:click={() => goto('/signup')}>sign up</div>
      </div>
    </div>
  {/if}
</nav>
