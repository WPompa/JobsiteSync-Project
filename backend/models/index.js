"use strict";

const Employees = require("./employees.model");
const Materials = require("./materials.model");
const stored_in = require("./stored_in.model");
const Storage_Areas = require("./storage_areas.model");
const Jobsites = require("./jobsites.model");
const Activity_Logs = require("./activity_logs.model");
const Credentials = require("./credentials.model");

module.exports = (sequelize, DataTypes) => {
  const Employee = Employees(sequelize, DataTypes);
  const Material = Materials(sequelize, DataTypes);
  const Stored_In = stored_in(sequelize, DataTypes);
  const Storage_Area = Storage_Areas(sequelize, DataTypes);
  const Jobsite = Jobsites(sequelize, DataTypes);
  const Activity_Log = Activity_Logs(sequelize, DataTypes);
  const Credential = Credentials(sequelize, DataTypes);

  // Authentication & Account Mapping (1:1)
  Employee.hasOne(Credential, {
    foreignKey: "EmpID",
    onDelete: "CASCADE",
  });
  Credential.belongsTo(Employee, {
    foreignKey: "EmpID",
  });

  // Organizational Hierarchies
  Employee.hasMany(Employee, {
    as: "subordinates",
    foreignKey: "SupervisorID",
    onDelete: "SET NULL",
  });
  Employee.belongsTo(Employee, {
    as: "supervisor",
    foreignKey: "SupervisorID",
    onDelete: "SET NULL",
  });

  // Jobsite -> Employee
  Jobsite.hasMany(Employee, {
    foreignKey: "JobsiteID",
    onDelete: "SET NULL",
  });
  Employee.belongsTo(Jobsite, {
    foreignKey: "JobsiteID",
    onDelete: "SET NULL",
  });

  // Jobsite -> Storage Area
  Jobsite.hasMany(Storage_Area, {
    foreignKey: "JobsiteID",
    onDelete: "SET NULL",
  });
  Storage_Area.belongsTo(Jobsite, {
    foreignKey: "JobsiteID",
    onDelete: "SET NULL",
  });

  // Inventory Relationships (Many-To-Many)
  Material.belongsToMany(Storage_Area, {
    through: Stored_In,
    foreignKey: "MaterialID",
    otherKey: "StorageAreaID",
  });
  Storage_Area.belongsToMany(Material, {
    through: Stored_In,
    foreignKey: "StorageAreaID",
    otherKey: "MaterialID",
  });

  //For development use only.
  /* sequelize.sync({ alter: true });
  console.log("models.sync({ alter: true })"); */
};
