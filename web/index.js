const Koa = require('koa');
const serve = require('koa-static');
const http = require('http');

const config = require('./config');
const router = require('./router');
const createWSServer = require('./wss');

const app = new Koa();
app.use(serve('dist'));
app.use(router.routes());

const server = http.createServer(app.callback());
const wss = createWSServer(server);

server.listen(config.port);
