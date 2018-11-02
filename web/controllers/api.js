const db = require('../db');
const segregateThreads = require('../helpers/segregateThreads');

module.exports.user = async ctx => {
  const user = await db.getUser(ctx.state.steamid);
  if (!user) return { exists: false, steamid: ctx.state.steamid };

  const giveaways = await db.getUserGiveaways(ctx.state.steamid);

  return {
    exists: !!user,
    steamid: ctx.state.steamid,
    credits: user.credits,
    giveaways
  };
};

module.exports.threads = async ctx => {
  const threads = await db.getThreads();
  return segregateThreads(threads);
};
