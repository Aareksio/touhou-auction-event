const jwt = require('jsonwebtoken');

const config = require('./config');

module.exports = async (ctx, next) => {
  const token = ctx.cookies.get('token');
  if (!token) return ctx.throw(401);

  const { steamid } = jwt.verify(token, config.secret);
  ctx.state.steamid = steamid;

  return next();
};


