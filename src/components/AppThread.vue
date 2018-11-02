<template>
  <li class="thread" v-if="thread.isOver">#{{ thread.id}} - <a :href="thread.threadURL" target="_blank">visit</a> - won by <a :href="thread.winnerURL">{{ thread.winner.username }}</a> {{ thread.bidLocaleTime }} - {{ thread.bid }} credits</li>
  <li class="thread" v-else-if="thread.winner.steamid">#{{ thread.id}} - <a :href="thread.threadURL" target="_blank">visit</a> - top bid by <a :href="thread.winnerURL" target="_blank">{{ thread.winner.username }}</a> {{ thread.timeAgo }} - {{ thread.bid }} credits</li>
  <li class="thread" v-else>#{{ thread.id}} - <a :href="thread.threadURL" target="_blank">visit</a> - {{ thread.timeAgo }} - {{ thread.bid }} credits</li>
</template>

<script>
  export default {
    props: {
      thread: Object
    },
    name: 'AppThread'
  };
</script>
