<script>
  import { fade } from "svelte/transition";

  let answer;

  let poem = [
    {
      verses: [
        "Do not go gentle into that good night,",
        "Old age should burn and rave at close of day;",
        "Rage, rage against the dying of the light."
      ],
      poet: "Dylan Thomas"
    },
    {
      verses: [
        "Though wise men at their end know dark is right,",
        "Because their words had forked no lightning",
        "They Do not go gentle into that good night."
      ],
      poet: "Dylan Thomas"
    },
    {
      verses: [
        "Good men, the last wave by, crying how bright",
        "Their frail deeds might have danced in a green bay,",
        " Rage, rage against the dying of the light."
      ],
      poet: "Dylan Thomas"
    },
    {
      verses: [
        "Wild men who caught and sang the sun in flight,",
        "And learn, too late, they grieved it on its way",
        "Do not go gentle into that good night."
      ],
      poet: "Dylan Thomas"
    },
    {
      verses: [
        "Grave men, near death, who see with blinding sight",
        "Blind eyes could blaze like meteors and be gay,",
        "Rage, rage against the dying of the light."
      ],
      poet: "Dylan Thomas"
    },
    {
      verses: [
        "And you, my father, there on that sad height,",
        "Curse, bless, me now with your fierce tears, I pray.",
        "Do not go gentle into that good night.",
        "Rage, rage against the dying of the light."
      ],
      poet: "Dylan Thomas"
    }
  ];
  let stanza = poem[0];
  let i = 0;
  let visible = true;
  function cycle() {
    ++i;
    i = i % poem.length;
    stanza = poem[i];
    visible = false;
    setTimeout(show, 500);
  }
  function show() {
    visible = true;
  }
  setInterval(cycle, 10000);
</script>

<style>
  footer {
    color: #fff;
    font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    background-color: rgb(9, 9, 9);
    height: 46px;
    line-height: 46px;
    font-size: 13px;
    text-align: center;
  }
  .left {
    text-align: right;
  }
  .quotes {
    font-size: 9px;
    color: #fff;
  }
  .brand {
    text-align: center;
    font-size: 80px;
    color: rgb(255, 237, 54);
  }
  .content {
    background-color: rgb(15, 15, 15);
  }
</style>

<div bp="grid 1" class="content">
  <div bp="6" class="brand">bitkido</div>
  <div bp="3 padding-top--lg padding-bottom--lg">
    <div class="quotes">
      {#if visible}
        <div>
          {#each stanza.verses as verse, i}
            <p bp="margin--none" transition:fade>{verse}</p>
          {/each}
          <p bp="margin--none" transition:fade class="left">- {stanza.poet}</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<footer>© 2020 Flowy Inc.</footer>
