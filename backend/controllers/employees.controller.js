const service = require("../services/employees.service");
const asyncWrapper = require("../middleware/asyncWrapper");

const getEmployees = asyncWrapper(async (req, res, next) => {
  const { page, limit } = req.query;
  const { employees } = req.models;
  const sequelize = req.sequelize;

  const { result, metadata } = await service.getEmployees(
    sequelize,
    employees,
    page,
    limit,
  );

  res.status(200).json({ status: "success", result, pagination: metadata });
});

const createEmployee = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { employees } = req.models;

  const result = await service.createEmployee(employees, body);

  res
    .status(201)
    .json({ status: "success", result, message: "Employee Created!" });
});

const updateEmployees = asyncWrapper(async (req, res, next) => {
  const { body, useEmpty } = req.body;
  const { employees } = req.models;

  const result = await service.updateEmployees(employees, body, useEmpty);

  if (result === null) {
    return res.status(204).send();
  }

  res
    .status(200)
    .json({ status: "success", result, message: "Employee(s) Updated!" });
});

const patchEmployee = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { employees } = req.models;

  const result = await service.patchEmployee(employees, id, req.body);

  res
    .status(200)
    .json({ status: "success", result, message: "Employee Updated!" });
});

const deleteEmployees = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { employees } = req.models;

  const result = await service.deleteEmployees(employees, body);

  res
    .status(200)
    .json({ status: "success", result, message: "Employee(s) Deleted!" });
});

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployees,
  patchEmployee,
  deleteEmployees,
};
