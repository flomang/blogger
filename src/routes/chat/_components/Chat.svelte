<script>
  //import { stores } from "@sapper/app";
  import { beforeUpdate, afterUpdate } from "svelte";
  import Textfield from "@smui/textfield";
  import { fade } from "svelte/transition";
  import ElizaBot from "elizabot";

  export let user;

  //const { session } = stores();
  const eliza = new ElizaBot();

  let comments = [];
  let scrollableDiv;
  let textInput = "";
  let autoscroll;
  let scrollWidth = 0;
  let defaultAvatar = "aces.png";

  let users = [
    { username: "eliza", profileImage: "great-success.png" },
    { username: "Troll King", profileImage: "troll-king.png" },
    { username: "jack", profileImage: "joker-cartoon.png" },
    { username: "9 of Hearts", profileImage: "card-9-hearts.png" },
    { username: "Satoshi Bum", profileImage: "btc.png" },
    { username: "porky pig", profileImage: "porky.png" },
    { username: "pillboi", profileImage: "pill.png" },
    { username: "doge bot", profileImage: "doge.png" },
    { username: "joker", profileImage: "joker-card.png" },
    { username: "luv child", profileImage: "hearts.png" },
    { username: "cannibis420", profileImage: "cannabis-512.png" }
  ];
  user =  users[2];

  // add random comments
  let seed = eliza.getInitial();
  for (let i = 0; i < 10; ++i) {
    const user = users[Math.floor(Math.random() * users.length)];
    comments = comments
      .filter(comment => !comment.placeholder)
      .concat({
        username: user.username,
        text: eliza.transform(seed),
        profileImage: user.profileImage,
        type: "comment-text"
      });
  }

  beforeUpdate(() => {
    autoscroll =
      scrollableDiv &&
      scrollableDiv.offsetHeight + scrollableDiv.scrollTop >
        scrollableDiv.scrollHeight - 10;
  });

  afterUpdate(() => {
    if (autoscroll && scrollableDiv) {
      scrollableDiv.scrollTo(0, scrollableDiv.scrollHeight);
    }
  });

  let handleKeydown = event => {
    if (event.key === "Enter") {
      const text = event.target.value;
      if (!text) return;

      // FOR TEST
      comments = comments.concat({
         username: user.username,
         profileImage: user.profileImage ? user.profileImage : defaultAvatar,
         text: text,
         type: "comment"
      });

      scrollableDiv.scrollTo(0, scrollableDiv.scrollHeight);
      event.target.value = "";
      textInput = "";

      setTimeout(() => {
        const reply = eliza.transform(text);
        const user = users[Math.floor(Math.random() * users.length)];
        comments = comments
          .filter(comment => !comment.placeholder)
          .concat({
            username: user.username,
            text: reply,
            profileImage: user.profileImage,
            type: "comment"
         });
      }, 500 + Math.random() * 500);
    }
  };
</script>

<style>
  .trollbox {
    width: 100%;
  }
  
  .trollbox-scrollable {
    width: 100%;
    position: absolute;
    top: 50px;
    margin: 0 0 0.5em 0;
    padding-left: 30px;
    overflow-y: auto;
    height: 550px;
  }

  .trollbox-input {
    width: 100%;
    height: 100px;
    position: absolute;
    bottom: 0;
    padding-left: 30px;
    align-items: left;
    display: flex;
  }

  .trollbox-input-container {
    padding-top: 25px;
  }

  .trollbox-input-profile {
    height: 30px;
    width: 30px;
    margin-top: 20px;
    margin-right: 1em;
  }

  .comment-container {
    display: flex;
  }

  .comment-avatar {
    height: 30px;
    width: 30px;
    position: relative;
    top: -3px;
    margin-right: 1em;
  }

  .comment-username {
    color: #888;
    font-weight: bold;
    padding-right: 0.3em;
  }

  .comment-text {
    margin-bottom: 1em;
    color: #000;
  }
</style>

<svelte:head>
  <title>chat</title>
</svelte:head>

<div class="trollbox" transition:fade>
  <div class="trollbox-scrollable" bind:this={scrollableDiv}>
    {#each comments as comment}
      <div class="comment-container">
        <div>
          <img class="comment-avatar" alt="" src={comment.profileImage} />
        </div>
        <div class="comment-text">
          <span class="comment-username">{comment.username}</span>
          <span>{comment.text}</span>
        </div>
      </div>
    {/each}
  </div>

  <div class="trollbox-input">
    <div>
      <img
        class="trollbox-input-profile"
        alt=""
        src={user.profileImage ? user.profileImage : defaultAvatar} />
    </div>
    <div class="trollbox-input-container">
      <span class="comment-username">{user.username}</span>
      <Textfield
        bind:value={textInput}
        on:keydown={handleKeydown}
        />
    </div>
  </div>
</div>
