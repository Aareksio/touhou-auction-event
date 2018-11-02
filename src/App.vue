<template>
  <div id="app" :class="[`theme-${theme}`]">
    <header class="header">
      <div class="brand">
        <h1 class="brand__name brand__name--fake">Touhou Giveaways Auctions</h1>
        <h1 class="brand__name brand__name--real">&nbsp;&nbsp;&nbsp;Nep Giveaways Auctions</h1>
      </div>

      <a href="/login" class="login" v-if="!steamid">
        <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png">
      </a>
      <a href="/logout" class="logout" v-if="steamid">
        Logout
      </a>
    </header>

    <main>
      <p v-if="steamid">You are logged in as {{ steamid }} and have {{ credits }} credits remaining.</p>
      <p v-else>You are not logged in.</p>

      <div class="giveaways" v-if="userGiveaways.length">
        <p>Your giveaways:</p>

        <transition-group name="list" tag="ul">
          <li v-for="giveaway in userGiveaways" :key="giveaway.id"><a :href="giveaway.URL" target="_blank">{{ giveaway.URL }}</a> - {{ giveaway.bid }} credits - {{ giveaway.entries }} entries</li>
        </transition-group>
      </div>

      <div class="threads threads--active">
        <p>Active threads:</p>

        <transition-group name="list" tag="ul">
          <app-thread :thread="thread" v-for="thread in threads.active" :key="thread.id"></app-thread>
        </transition-group>
      </div>

      <div class="threads threads--archive">
        <p>Archive threads:</p>

        <transition-group name="list" tag="ul">
          <app-thread :thread="thread" v-for="thread in threads.archive" :key="thread.id"></app-thread>
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
  import { Thread } from './types/Thread';
  import { Giveaway } from './types/Giveaway';
  import AppThread from './components/AppThread.vue';

  const startingCredits = 2500;

  export default {
    name: 'App',
    components: { AppThread },
    data() {
      return {
        exists: false,
        steamid: null,
        credits: 0,
        userGiveaways: [],
        theme: 'dark',
        threads: {},
        updateThreadsTimeInterval: null,
        ws: null
      };
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
          const { success, response: { exists, steamid, credits, giveaways } } = await fetch('/api/user', { credentials: 'same-origin' }).then(r => r.json());
          this.exists = exists;
          this.steamid = steamid;
          this.credits = exists ? credits : startingCredits;
          this.userGiveaways = (giveaways || []).map(Giveaway.from);
        } catch (err) {}
      },
      async loadThreads() {
        try {
          const { success, response: threads } = await fetch('/api/threads').then(r => r.json());
          this.updateThreads(threads);
        } catch (err) {}
      },
      updateThreadsTIme() {
        this.threads.active.forEach(thread => thread.timeAgo = thread.getTimeAgo());
      },
      updateThreads(threads) {
        this.threads = {
          active: threads.active.map(Thread.from),
          archive: threads.archive.map(Thread.from)
        };
      },
      createWSConnection() {
        this.ws = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${window.location.host}/ws`);

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

  .list-move {
    transition: transform .5s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
  }

  .list-enter-active, .list-leave-active {
    transition: opacity .5s;
  }
</style>
