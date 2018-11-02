const KoaRouter = require('koa-router');

const auth = require('./auth');
const requireAuth = require('./middleware/requireAuth');
const wrapController = require('./helpers/wrapController');
const apiController = require('./controllers/api');

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
    ctx.cookies.set('token', token);
    ctx.redirect('/');
  } catch (err) {
    console.error(err);
    ctx.redirect('/login');
  }
});

router.get('/api/threads', wrapController(apiController.threads))
router.get('/api/user', requireAuth, wrapController(apiController.user));

module.exports = router;
