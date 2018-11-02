<template>
  <li class="thread" v-if="thread.isOver"><span class="round-id" v-html="thread.idHTML"></span> - <a :href="thread.threadURL" target="_blank">visit</a> - {{ thread.bidLocaleTime }} - <span v-html="thread.bidHTML"></span> credits by <a :href="thread.winnerURL" target="_blank">{{ thread.winner.username }}</a></li>
  <li class="thread" v-else-if="thread.winner.steamid"><span class="round-id" v-html="thread.idHTML"></span> - <a :href="thread.threadURL" target="_blank">visit</a> - <span v-html="thread.bidHTML"></span> credits by <a :href="thread.winnerURL" target="_blank">{{ thread.winner.username }}</a> - {{ thread.timeAgo }}</li>
  <li class="thread" v-else><span v-html="thread.idHTML"></span> - <a :href="thread.threadURL" target="_blank">visit</a> - <span v-html="thread.bidHTML"></span> credits - {{ thread.timeAgo }}</li>
</template>

<script>
  export default {
    props: {
      thread: Object
    },
    name: 'AppThread'
  };
</script>
