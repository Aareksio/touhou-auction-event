const openid = require('openid');
const util = require('util');
const jwt = require('jsonwebtoken');

const config = require('./config');

openid.RelyingParty.prototype.authenticate = util.promisify(openid.RelyingParty.prototype.authenticate);
openid.RelyingParty.prototype.verifyAssertion = util.promisify(openid.RelyingParty.prototype.verifyAssertion);

const identifierRegex = /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/;
const steamLogin = new openid.RelyingParty(config.returnUrl, null, true);

async function verifyOpenid(url) {
  const result = await steamLogin.verifyAssertion(url);
  if (!result.authenticated) throw Notification.error('verificationFailed');
  return result;
}

module.exports.verify = async function verify(url) {
  const response = await verifyOpenid(url);
  const steamid = identifierRegex.exec(response.claimedIdentifier)[1];
  return jwt.sign({ steamid }, config.secret);
};

module.exports.getAuthUrl = function getAuthUrl() {
  return steamLogin.authenticate('http://steamcommunity.com/openid', false);
};
