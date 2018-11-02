const WebSocket = require('ws');
const db = require('./db');
const segregateThreads = require('./helpers/segregateThreads');

module.exports = function createWSServer(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  async function updateThreads() {
    const threads = await db.getThreads();
    const data = JSON.stringify({ event: 'threads', payload: segregateThreads(threads) });
    wss.clients.forEach(client => client.send(data));
  }

  setInterval(updateThreads, 10000);

  return wss;
};
