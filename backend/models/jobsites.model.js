"use strict";

module.exports = (sequelize, DataTypes) => {
  const Jobsite = sequelize.define(
    "jobsites",
    {
      JobsiteID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      JobsiteName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          len: {
            msg: "Title must have 2 - 32 characters.",
            args: [2, 32],
          },
          is: {
            args: /^[a-z\d\s.\-#]+$/i,
            msg: "Jobsite name can only use alphanumeric characters, spaces, periods, hyphens, or hash signs.",
          },
        },
      },
      /* JobsiteSupervisorID: {
      type: DataTypes.INTEGER,
      references: {
        model: "employees",
        key: "EmpID",
      },
    }, */
    },
    {
      tableName: "jobsites",
      timestamps: false,
    },
  );

  return Jobsite;
};
