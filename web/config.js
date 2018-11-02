require('dotenv').config();

module.exports = {
  secret: process.env.SECRET,
  returnUrl: process.env.RETURN_URL,
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    supportBigNumbers: true,
    bigNumberStrings: true
  }
};
