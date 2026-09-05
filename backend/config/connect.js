//
const { Sequelize, DataTypes } = require("sequelize");
const Models = require("../models/");

let sequelize = null;

async function connectToDB() {
  if (sequelize) {
    console.log("Using cached database connection.");
    return { sequelize, models: sequelize.models };
  }

  console.log("Establishing new connection to database.");

  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      dialect: "mysql",
      pool: {
        max: 5,
        idle: 2000,
        acquire: 30000,
        evict: 2500,
      },
      logging: false,
      define: {
        timestamps: false,
      },
      dialectModule: require("mysql2"),
    },
  );

  try {
    await sequelize.authenticate();
    console.log("Connection Established.");

    Models(sequelize, DataTypes);
  } catch (error) {
    console.error("Connection Failed: ", error);
    sequelize = null;
    throw error;
  }

  return { sequelize, models: sequelize.models };
}

module.exports = connectToDB;
