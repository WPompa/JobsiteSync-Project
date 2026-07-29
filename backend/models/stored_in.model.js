"use strict";

module.exports = (sequelize, DataTypes) => {
  const Stored_In = sequelize.define(
    "stored_in",
    {
      StorageAreaID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "storage_areas",
          key: "StorageAreaID",
        },
      },
      MaterialID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "materials",
          key: "MaterialID",
        },
      },
      Amount: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        set(value) {
          if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value);

            this.setDataValue("Amount", isNaN(parsed) ? value : parsed);
          } else {
            this.setDataValue("Amount", value);
          }
        },
        validate: {
          isNumericOrInteger(value) {
            if (value === null || value === undefined || value === "") {
              throw new Error(
                "Amount is required and must be a valid integer.",
              );
            }

            if (typeof value !== "number" || isNaN(value)) {
              throw new Error("Amount must be a valid integer number.");
            }

            if (!Number.isInteger(value)) {
              throw new Error("Amount must be an integer.");
            }
          },
          isAboveMin(value) {
            if (typeof value === "number" && !isNaN(value) && value < 0) {
              throw new Error("Amount cannot be lower than 0.");
            }
          },
        },
      },
    },
    {
      tableName: "stored_in",
      timestamps: false,
    },
  );

  return Stored_In;
};
