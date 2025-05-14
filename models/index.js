const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : '';
const dbHost = process.env.DB_HOST || 'localhost';
if (!dbName || !dbUser || dbPassword === '') {
  throw new Error('Database credentials are missing or invalid.');
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  logging: false,
});

const db = {};
db.sequelize = sequelize;
db.User = require('./user')(sequelize, Sequelize);

module.exports = db;
