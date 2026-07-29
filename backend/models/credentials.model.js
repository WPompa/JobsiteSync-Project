"use strict";

module.exports = (sequelize, DataTypes) => {
  const Credential = sequelize.define(
    "credentials",
    {
      AccountID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Username: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: {
          msg: "This username is already taken.",
        },
        validate: {
          len: {
            msg: "Username must have 4 - 64 characters.",
            args: [4, 64],
          },
          is: {
            args: /^[a-z0-9_\-]+$/i,
            msg: "Username can only use alphanumeric characters, underscores, or hyphens.",
          },
        },
      },
      Password: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      EmpID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          msg: "Only one account allowed per employee.",
        },
        references: {
          model: "employees",
          key: "EmpID",
        },
      },
      IsAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "credentials",
      timestamps: false,
    },
  );

  return Credential;
};
