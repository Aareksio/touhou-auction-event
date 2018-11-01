const WebSocket = require('ws');
const db = require('./db');

function getThreads() {
  return db.query('SELECT `round_id`, `thread_id`, `bid`, `last_comment_id`, `last_bid` FROM `auction_threads` WHERE `status` != 255');
}

module.exports = function createWSServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  async function updateThreads() {
    const activeThreads = await getThreads();
    const data = JSON.stringify({ event: 'threads', payload: activeThreads });
    wss.clients.forEach(client => client.send(data));
  }

  setInterval(updateThreads, 10000);

  return wss;
};
