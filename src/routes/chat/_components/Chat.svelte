<script>
  import { beforeUpdate, afterUpdate } from "svelte";
  import Textfield from "@smui/textfield";
  import { fade } from "svelte/transition";
  import ElizaBot from "elizabot";

  export let user;

  let comments = [];
  let autoscroll;
  let scrollableDiv;
  let textInput = "";
  const defaultAvatar = "great-success.png";

  let users = [
    { username: "eliza", profileImage: "great-success.png" },
    { username: "Troll King", profileImage: "troll-king.png" },
    { username: "jack", profileImage: "joker-cartoon.png" },
    { username: "9 of Hearts", profileImage: "card-9-hearts.png" },
    { username: "Satoshi Bum", profileImage: "btc.png" },
    { username: "porky pig", profileImage: "porky.png" },
    { username: "pillboi", profileImage: "pill.png" },
    { username: "joker", profileImage: "joker-card.png" },
    { username: "luv child", profileImage: "hearts.png" },
    { username: "cannibis420", profileImage: "cannabis-512.png" },
  ];

  const eliza = new ElizaBot();
  // add random comments
  let seed = eliza.getInitial();
  for (let i = 0; i < 10; ++i) {
    const usr = users[Math.floor(Math.random() * users.length)];
    comments = comments
      .filter((comment) => !comment.placeholder)
      .concat({
        username: usr.username,
        text: eliza.transform(seed),
        profileImage: usr.profileImage,
        type: "comment-text",
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

  let handleKeydown = (event) => {
    if (event.key === "Enter") {
      if (!textInput) return;

      // FOR TEST
      comments = comments.concat({
        username: user.username,
        profileImage: user.avatar_url ? user.avatar_url : defaultAvatar,
        text: textInput,
        type: "comment",
      });

      scrollableDiv.scrollTo(0, scrollableDiv.scrollHeight);
      event.target.value = "";
      textInput = "";

      setTimeout(() => {
        const reply = eliza.transform(textInput);
        const user = users[Math.floor(Math.random() * users.length)];
        comments = comments
          .filter((comment) => !comment.placeholder)
          .concat({
            username: user.username,
            text: reply,
            profileImage: user.profileImage,
            type: "comment",
          });
      }, 500 + Math.random() * 500);
    }
  };
</script>

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
        src={user.avatar_url ? user.avatar_url : defaultAvatar}
      />
    </div>
    <div class="trollbox-input-container">
      <span class="comment-username">{user.username ? user.username : "" }</span>
      <Textfield
        bind:value={textInput}
        on:keydown={handleKeydown}
        label="Say something..."
      />
    </div>
  </div>
</div>

<style>
  .trollbox {
    width: 50%;
  }

  .trollbox-scrollable {
    position: absolute;
    top: 50px;
    margin: 0 0 0.5em 0;
    padding-left: 30px;
    overflow-y: auto;
    height: 585px;
  }

  .trollbox-input {
    height: 100px;
    position: absolute;
    bottom: 0;
    padding-left: 30px;
    padding-right: 30px;
    align-items: left;
    display: flex;
  }

  .trollbox-input-container {
    width: 100%;
    padding-top: 25px;
  }

  .trollbox-input-profile {
    height: 30px;
    width: 30px;
    margin-top: 46px;
    margin-right: 1em;
  }

  .comment-container {
    display: flex;
  }

  .comment-avatar {
    height: 30px;
    width: 30px;
    position: relative;
    top: -6px;
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
