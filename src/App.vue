<template>
  <div id="app" :class="[`theme-${theme}`]">
    <header class="header">
      <div class="brand">
        <h1 class="brand__name brand__name--fake">Touhou Giveaways Auctions</h1>
        <h1 class="brand__name brand__name--real">   Nep Giveaways Auctions</h1>
      </div>

      <a href="/login" class="login" v-if="!steamid">
        <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png">
      </a>
      <a href="/logout" class="logout" v-if="steamid">
        Logout
      </a>
    </header>

    <main>
      <div class="user" v-if="steamid">
        <p>You are logged in as {{ steamid }} and have {{ credits }} credits remaining.</p>

        <p v-if="userGiveaways.length">Giveaways you won:</p>
        <ul v-if="userGiveaways.length">
          <li v-for="giveaway in userGiveaways" :key="giveaway.id"><a :href="`https://www.steamgifts.com/giveaway/${giveaway.id}/`" target="_blank">{{ `https://www.steamgifts.com/giveaway/${giveaway.id}/` }}</a> - {{ giveaway.bid }} credits</li>
        </ul>
      </div>

      <div class="user" v-else>
        You are not logged in.
      </div>

      <div class="active-threads">
        <p>Currently active threads:</p>
        <transition-group name="thread-list" tag="ul">
          <li class="thread" v-for="thread in threads" :key="thread.id">#{{ thread.id}} - <a :href="thread.threadURL" target="_blank">visit</a> - {{ thread.bid }} credits - {{ thread.timeAgo }} </li>
        </transition-group>
      </div>
    </main>

    <footer class="footer">
      <p class="footer__element">Delivered with love by Touhou Giveawways</p>
      <p class="footer__element footer__theme" v-if="theme !== 'light'" @click="theme = 'light'">Make my eyes burn</p>
      <p class="footer__element footer__theme" v-if="theme !== 'dark'" @click="theme = 'dark'">Take me to the shadows</p>
    </footer>
  </div>
</template>

<script>
  import * as humanizeDuration from 'humanize-duration';

  const startingCredits = 2500;

  class Thread {
    constructor(data) {
      this.id = data.round_id;
      this.threadId = data.thread_id;
      this.bid = data.bid;
      this.bidTime = new Date(data.last_bid);
      this.timeAgo = this.getTimeAgo();
    }

    getTimeAgo() {
      return humanizeDuration(this.bidTime - Date.now(), { round: true }) + ' ago';
    }

    get threadURL() {
      return `https://www.steamgifts.com/discussion/${this.threadId}`
    }
  }

  export default {
    name: 'App',
    data() {
      return {
        exists: false,
        steamid: null,
        credits: 0,
        userGiveaways: [],
        theme: 'dark',
        threads: [],
        updateThreadsTimeInterval: null,
        ws: null
      }
    },
    watch: {
      theme: {
        handler() {
          localStorage.setItem('auction-theme', this.theme);
        }
      }
    },
    created() {
      this.recoverCachedTheme();
      this.loadUser();
      this.loadThreads();
      this.updateThreadsTimeInterval = setInterval(() => this.updateThreadsTIme(), 1000);
      this.createWSConnection();
    },
    methods: {
      recoverCachedTheme() {
        const theme = localStorage.getItem('auction-theme');
        if (theme) this.theme = theme;
      },
      async loadUser() {
        try {
          const { exists, steamid, credits, giveaways } = await fetch('/api/user', { credentials: 'same-origin' }).then(r => r.json());
          this.exists = exists;
          this.steamid = steamid;
          this.credits = exists ? credits : startingCredits;
          this.userGiveaways = giveaways || [];
        } catch (err) {}
      },
      async loadThreads() {
        try {
          const threads = await fetch('/api/threads').then(r => r.json());
          this.threads = threads.map(data => new Thread(data));
        } catch (err) {}
      },
      updateThreadsTIme() {
        this.threads.forEach(thread => thread.timeAgo = thread.getTimeAgo());
      },
      updateThreads(threads) {
        this.threads = threads.map(data => new Thread(data));
      },
      createWSConnection() {
        this.ws = new WebSocket(`ws://${window.location.host}/ws`);

        this.ws.addEventListener('message', ({ data }) => {
          const { event, payload } = JSON.parse(data);
          if (event === 'threads') this.updateThreads(payload);
        });
      }
    }
  };
</script>

<style lang="scss">
  body {
    padding: 0;
    margin: 0;
    font-family: monospace;
  }

  a {
    color: inherit;
  }

  #app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    background: #111;
    color: #bbb;
  }

  #app.theme-dark {
    background: #111;
    color: #bbb;
  }

  #app.theme-light {
    background: #eee;
    color: #333;
  }

  .header {
    width: 100%;
    display: flex;
    border-bottom: solid 1px #777;
    justify-content: space-between;
    padding: 0 2em;
    box-sizing: border-box;
  }

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .brand__name--real {
    display: none;
    white-space: pre;
  }

  .brand:hover .brand__name--fake {
    display: none;
  }

  .brand:hover .brand__name--real {
    display: initial;
  }

  .login, .logout {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1em;
  }

  main {
    padding: 1em 2em;
  }

  .footer {
    border-top: solid 1px #777;
    padding: 0 2em;
    display: flex;
    justify-content: space-between;
  }

  .footer__element {
    display: inline-block;
  }

  .footer__theme {
    cursor: pointer;
    text-decoration: underline;
  }

  @media screen and (max-width: 800px) {
    .header {
      flex-direction: column;
      padding: 0 0 2em;
    }
  }

  @media screen and (max-width: 800px) {
    .footer {
      flex-direction: column-reverse;
      text-align: center;
      padding: 1em 0;
    }

    .footer__element {
      margin: 0.25em;
    }
  }

  .thread-list-move {
    transition: transform .5s;
  }

  .thread-list-enter, .thread-list-leave-to {
    opacity: 0;
  }

  .thread-list-enter-active, .thread-list-leave-active {
    transition: opacity .5s;
  }
</style>
