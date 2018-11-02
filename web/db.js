const mysql = require('mysql2/promise');

const config = require('./config');

const pool = mysql.createPool(config.database);

module.exports.query = async (query, bindings) => {
  const [result] = await pool.query(query, bindings);
  return result;
};

module.exports.getThreads = async () => {
  return module.exports.query('SELECT `round_id`, `thread_id`, `bid`, `last_bid`, `auction_users`.`steam_id`, `username`, `status` FROM `auction_threads` LEFT JOIN `auction_users` ON `auction_users`.`steam_id` = `auction_threads`.`steam_id` ORDER BY `last_bid` DESC');
};

module.exports.getUser = async steamid => {
  const [user] = await module.exports.query('SELECT `credits` FROM `auction_users` WHERE `steam_id` = ?', [steamid]);
  return user;
};

module.exports.getUserGiveaways = async steamid => {
  return module.exports.query('SELECT `auction_threads`.`giveaway_id`, `bid`, `entries` FROM `auction_threads` JOIN `auction_giveaways` ON `auction_giveaways`.`giveaway_id` = `auction_threads`.`giveaway_id` WHERE `steam_id` = ? AND `auction_threads`.`status` = 255', [steamid]);
};
