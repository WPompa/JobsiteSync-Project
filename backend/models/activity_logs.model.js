module.exports = (sequelize, DataTypes) => {
  const Activity_Log = sequelize.define(
    "activity_logs",
    {
      LogID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ActionType: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      MaterialName: {
        type: DataTypes.STRING(75),
        allowNull: true,
      },
      StorageLocation: {
        type: DataTypes.STRING(75),
        allowNull: true,
      },
      JobsiteName: {
        type: DataTypes.STRING(75),
        allowNull: true,
      },
      QuantityChanged: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      HandledBy: {
        type: DataTypes.STRING(75),
        allowNull: false,
      },
      Timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "activity_logs",
      timestamps: false,
    },
  );

  return Activity_Log;
};
