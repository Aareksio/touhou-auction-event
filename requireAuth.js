const jwt = require('jsonwebtoken');

const config = require('./config');

module.exports = async (ctx, next) => {
  const token = ctx.cookies.get('token') || ctx.cookies.get('token');
  if (!token) return ctx.throw(401, 'Token not present');

  try {
    const { steamid } = jwt.verify(token, config.secret);
    ctx.state.steamid = steamid;
  } catch (err) {
    return ctx.throw(401, 'Failed to verify token');
  }

  return next();
};


