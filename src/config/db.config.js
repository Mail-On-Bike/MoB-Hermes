require("dotenv").config();

module.exports = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: 3306,
  timezone: "-05:00",
  define: {
    charset: "utf8",
    dialectOptions: {
      collate: "utf8_general_ci",
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // Configurar Seeds
  seederStorage: "sequelize",
  seederStorageTableName: "seeds",

  // Configurar Migraciones
  migrationStorage: "sequelize",
  migrationStorageTableName: "migrations",
};
