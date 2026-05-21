"use strict";

module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define(
    "materials",
    {
      MaterialID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: {
            msg: "Must have 2 - 64 characters.",
            args: [2, 64],
          },
          is: {
            args: /^[a-z\d\s.]+$/i,
            msg: "Material name can only use alphabet characters, spaces, or periods.",
          },
        },
      },
      MaterialType: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: {
            msg: "Must have 2 - 64 characters.",
            args: [2, 64],
          },
          is: {
            args: /^[a-z\s.]+$/i,
            msg: "Material type can only use alphabet characters, spaces, or periods.",
          },
        },
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
      SupplierName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: {
            msg: "Must have 2 - 64 characters.",
            args: [2, 64],
          },
          is: {
            args: /^[a-z\d\s.]+$/i,
            msg: "Supplier name can only use alphabet characters, spaces, or periods.",
          },
        },
      },
      TotalAvailable: {
        type: DataTypes.SMALLINT,
      },
      LostAmounts: {
        type: DataTypes.SMALLINT,
      },
    },
    {
      tableName: "materials",
      //timestamps: false,
    },
  );

  return Material;
};
