const { AppError } = require("../utils/AppError");
const { QueryTypes } = require("sequelize");
const tables = require("../utils/RawQueries");
const getPagination = require("../utils/paginationHelper");
const {
  checkForRequiredValues,
  removeEmptyValues,
  processKeyValues,
  setUpdateOptions,
  setDeleteOptions,
  filterImmutableData,
} = require("../utils/serviceHelpers");

const table = {
  name: "employees",
  primaryKeys: ["EmpID"],
};

const getEmployees = async (
  sequelize,
  employeeModel,
  currentPage,
  currentLimit,
) => {
  //const totalCount = await employeeModel.count();
  [{ Count: totalCount }] = await sequelize.query(tables[table.name].count, {
    type: QueryTypes.SELECT,
  });

  const { offset, limit, metadata } = getPagination(
    currentPage,
    currentLimit,
    totalCount,
  );

  /* const result = await employeeModel.findAll({
    attributes: [
      "EmpID",
      ["Fname", "Forename"],
      ["Lname", "Surname"],
      "Title",
      "SupervisorID",
      "JobsiteID",
    ],
    offset,
    limit,
  }); */
  const result = await sequelize.query(tables[table.name].query, {
    replacements: { limit, offset },
    type: QueryTypes.SELECT,
  });

  //If pagination works as intended this snippet might never be used.
  if (result.length === 0) {
    throw new AppError("No Data For Selected Page", 200);
  }

  return { result, metadata };
};

const createEmployee = async (employeeModel, employeeData) => {
  const required = ["Fname", "Lname"];

  checkForRequiredValues(required, employeeData);

  removeEmptyValues(employeeData);

  //If Primary key value is given, check if it is already in use.
  if (employeeData?.EmpID) {
    const [instanceObj, isCreated] = await employeeModel.findOrCreate({
      where: { EmpID: employeeData.EmpID },
      defaults: employeeData,
    });

    if (!isCreated) {
      console.log(`Employee With ID "${employeeData.EmpID}" Already Exists!`);
      throw new AppError(
        `Employee With ID "${employeeData.EmpID}" Already Exists!`,
        409,
      );
    }

    return instanceObj.get({ plain: true });
  }

  const result = await employeeModel.create(employeeData); // Note : {fields: []} to exclude injected key-values.

  return result.get({ plain: true });
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateEmployees = async (employeeModel, employeeData, useEmpty) => {
  const required = ["EmpID"];

  checkForRequiredValues(required, employeeData);

  removeEmptyValues(employeeData, useEmpty);

  const primaryKeyValuesArr = processKeyValues(
    table.primaryKeys,
    employeeData,
    true,
  );

  filterImmutableData(primaryKeyValuesArr, table.name);

  if (primaryKeyValuesArr[0].EmpID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const options = setUpdateOptions(table.primaryKeys, primaryKeyValuesArr);

  await employeeModel.update(employeeData, {
    where: options,
  });

  const updatedRows = await employeeModel.findAll({
    where: options,
    raw: true,
  });

  if (!updatedRows || updatedRows.length === 0) {
    throw new AppError(
      "No record(s) found matching the provided identifier(s).",
      404,
    );
  }

  if (updatedRows.length >= 50) {
    return null;
  }

  return updatedRows;
};

const patchEmployee = async (employeeModel, EmpID, patchData) => {
  // Suggested to defend against malicious modifications targeting primary key
  delete patchData?.EmpID;

  if (!patchData || Object.keys(patchData).length === 0) {
    throw new AppError("Body cannot be empty.", 400);
  }

  const dataToFilter = { EmpID: [EmpID] };

  filterImmutableData(dataToFilter, table.name);

  if (dataToFilter.EmpID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const result = await employeeModel.update(patchData, {
    where: { EmpID },
  });

  if (result[0] > 0) {
    const updatedRow = await employeeModel.findOne({ where: { EmpID } });

    return updatedRow.get({ plain: true });
  }

  const existingRow = await employeeModel.findOne({ where: { EmpID } });

  if (!existingRow) {
    throw new AppError(`No record found for employee: ${EmpID}`, 404);
  }

  // The data was identical (200 OK)
  return existingRow.get({ plain: true });
};

const deleteEmployees = async (employeeModel, employeeData) => {
  removeEmptyValues(employeeData);

  const keyValuesArr = processKeyValues(
    Object.keys(employeeData),
    employeeData,
  );

  if (!keyValuesArr || keyValuesArr.length === 0) {
    throw new AppError(
      "Deletion Denied: No valid matching criteria provided.",
      400,
    );
  }

  const options = setDeleteOptions(keyValuesArr, "EmpID");

  const result = await employeeModel.destroy({
    where: options,
  });

  if (result === 0) {
    throw new AppError("No matching records found to delete.", 404);
  }

  return {
    deletedRows: result,
    identifiers: employeeData,
  };
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployees,
  patchEmployee,
  deleteEmployees,
};
