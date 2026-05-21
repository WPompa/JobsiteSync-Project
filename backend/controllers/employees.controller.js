const service = require("../services/employees.service");
const asyncWrapper = require("../middleware/asyncWrapper"); //Try Catch wrapper

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

  res.status(200).json({ status: "Success!", result, pagination: metadata });
});

const createEmployee = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { employees } = req.models;

  const result = await service.createEmployee(employees, body);

  //console.log(JSON.stringify(result));
  res.status(201).json({ status: "Success!", result });
});

const updateEmployees = asyncWrapper(async (req, res, next) => {
  const { body, useEmpty } = req.body;
  const { employees } = req.models;

  const result = await service.updateEmployees(employees, body, useEmpty);

  // Just a reminder to self that DB constraints or an extensive list of rows need to be handled. This is temp.
  if (result === null) {
    return res.status(204).send();
  }

  res.status(200).json({ status: "Success!", result });
});

const patchEmployee = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { employees } = req.models;

  const result = await service.patchEmployee(employees, id, req.body);

  res.status(200).json({ status: "Success!", result });
});

const deleteEmployees = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { employees } = req.models;

  const result = await service.deleteEmployees(employees, body);

  res.status(200).json({ status: "Success!", result });
});

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployees,
  patchEmployee,
  deleteEmployees,
};
