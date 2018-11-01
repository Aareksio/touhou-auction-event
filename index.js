const Koa = require('koa');
const serve = require('koa-static');
const KoaRouter = require('koa-router');

const auth = require('./auth');
const db = require('./db');
const requireAuth = require('./requireAuth');

const config = require('./config');

const app = new Koa();
const router = new KoaRouter();

router.get('/login', async ctx => {
  ctx.redirect(await auth.getAuthUrl());
});

router.get('/logout', async ctx => {
  ctx.cookies.set('token');
  ctx.redirect('/');
});

router.get('/verify', async ctx => {
  if (ctx.query['openid.op_endpoint'] !== 'https://steamcommunity.com/openid/login') return ctx.redirect('/login');

  try {
    const token = await auth.verify(ctx.url);
    ctx.cookies.set('2hu-event-pass', token);
    ctx.redirect('/');
  } catch (err) {
    console.error(err);
    ctx.redirect('/login');
  }
});

router.get('/api/user', requireAuth, async ctx => {
  const [user] = await db.query('SELECT `credits` FROM `auction_users` WHERE `steam_id` = ?', [ctx.state.steamid]);

  if (!user) {
    ctx.body = {
      exists: false,
      steamid: ctx.state.steamid
    };

    return;
  }

  const giveaways = await db.query('SELECT `giveaway_id`, `bid` FROM `auction_threads` WHERE `steam_id` = ? AND `status` = 255', [ctx.state.steamid]);

  ctx.body = {
    exists: !!user,
    steamid: ctx.state.steamid,
    credits: user.credits,
    giveaways: giveaways.map(ga => ({ id: ga.giveaway_id, bid: ga.bid }))
  };
});

router.get('/api/test', async ctx => {
  ctx.body = {
    token: ctx.cookies.get('token'),
    '2hu-event-pass': ctx.cookies.get('2hu-event-pass')
  };
});

app.use(serve('public'));
app.use(router.routes());

app.listen(config.port);
