"use strict";
/* const { sequelize } = require("../database/connect"); 
const { DataTypes } = require("sequelize");*/

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "employees",
    {
      EmpID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Fname: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          len: {
            msg: "First name must have 2 - 32 characters.",
            args: [2, 32],
          },
          is: {
            args: /^[a-z\s.\-']+$/i,
            msg: "First name can only use alphabet characters, spaces, periods, hyphens, or apostrophes.",
          },
        },
      },
      Lname: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          len: {
            msg: "Last name must have 2 - 32 characters.",
            args: [2, 32],
          },
          is: {
            args: /^[a-z\s.\-']+$/i,
            msg: "Last name can only use alphabet characters, spaces, periods, hyphens, or apostrophes.",
          },
        },
      },
      Title: {
        type: DataTypes.STRING(32),
        allowNull: true,
        validate: {
          len: {
            msg: "Title must have 2 - 32 characters.",
            args: [2, 32],
          },
          is: {
            args: /^[a-z0-9\s.\-/&]+$/i,
            msg: "Title can only contain letters, numbers, spaces, periods, hyphens, slashes, or ampersands.",
          },
        },
      },
      SupervisorID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "EmpID",
        },
      },
      JobsiteID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "jobsites",
          key: "JobsiteID",
        },
      },
    },
    {
      tableName: "employees",
      timestamps: false,
    },
  );
  return Employee;
};

//Creation example: const employee = await Employee.create({objFromFrontend}, {fields: [allowedValuesUnlistedAreIgnored]})

//Creation example: const employee = await Employee.create({objFromFrontend}, {fields: [allowedValuesUnlistedAreIgnored]})
/*
module.exports = Employee;
 */
