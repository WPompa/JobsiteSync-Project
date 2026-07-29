"use strict";

module.exports = (sequelize, DataTypes) => {
  const Storage_Area = sequelize.define(
    "storage_areas",
    {
      StorageAreaID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Length: {
        type: DataTypes.DECIMAL(5, 2),
      },
      Width: {
        type: DataTypes.DECIMAL(5, 2),
      },
      Height: {
        type: DataTypes.DECIMAL(5, 2),
      },
      Location: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: {
            msg: "Location must have 2 - 64 characters.",
            args: [2, 64],
          },
          is: {
            args: /^[a-z\d\s.\-/#]+$/i,
            msg: "Location can only use alphanumeric characters, spaces, periods, hyphens, slashes, or hash signs.",
          },
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
      TotalStored: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      Is_Container: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "storage_areas",
      timestamps: false,
    },
  );

  return Storage_Area;
};
