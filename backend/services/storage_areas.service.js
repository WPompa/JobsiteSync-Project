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
  name: "storage_areas",
  primaryKeys: ["StorageAreaID"],
};

const getStorage_Areas = async (
  sequelize,
  storage_areaModel,
  currentPage,
  currentLimit,
) => {
  //const totalCount = await storage_areaModel.count();
  [{ Count: totalCount }] = await sequelize.query(tables[table.name].count, {
    type: QueryTypes.SELECT,
  });

  const { offset, limit, metadata } = getPagination(
    currentPage,
    currentLimit,
    totalCount,
  );

  /* const result = await storage_areaModel.findAll({
    attributes: [
      "StorageAreaID",
      ["Length", "Inner Length"],
      ["Width", "Inner Width"],
      ["Height", "Inner Height"],
      "Location",
      ["JobsiteID", "Jobsite"],
      ["TotalStored", "Total Items"],
      ["Is_Container", "Container?"],
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

const createStorage_Area = async (storage_areaModel, storage_areaData) => {
  const required = ["Location"];

  checkForRequiredValues(required, storage_areaData);

  removeEmptyValues(storage_areaData);

  //If Primary key value is given, check if it is already in use.
  if (storage_areaData?.StorageAreaID) {
    const [instanceObj, isCreated] = await storage_areaModel.findOrCreate({
      where: {
        StorageAreaID: storage_areaData.StorageAreaID,
      },
      defaults: storage_areaData,
    });

    if (!isCreated) {
      console.log(
        `Storage Area With ID "${storage_areaData.StorageAreaID}" Already Exists!`,
      );
      throw new AppError(
        `Storage Area With ID "${storage_areaData.StorageAreaID}" Already Exists!`,
        409,
      );
    }

    return instanceObj.get({ plain: true });
  }

  const result = await storage_areaModel.create(storage_areaData); //{fields: []} to exclude injected key-values.

  return result.get({ plain: true });
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateStorage_Areas = async (
  storage_areaModel,
  storage_areaData,
  useEmpty,
) => {
  const required = ["StorageAreaID"];

  checkForRequiredValues(required, storage_areaData);

  removeEmptyValues(storage_areaData, useEmpty);

  const primaryKeyValuesArr = processKeyValues(
    table.primaryKeys,
    storage_areaData,
    true,
  );

  filterImmutableData(primaryKeyValuesArr, table.name);

  if (primaryKeyValuesArr[0].StorageAreaID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const options = setUpdateOptions(table.primaryKeys, primaryKeyValuesArr);

  await storage_areaModel.update(storage_areaData, {
    where: options,
  });

  const updatedRows = await storage_areaModel.findAll({
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

const patchStorage_Area = async (
  storage_areaModel,
  StorageAreaID,
  patchData,
) => {
  delete patchData?.StorageAreaID;

  if (!patchData || Object.keys(patchData).length === 0) {
    throw new AppError("Body cannot be empty.", 400);
  }

  const dataToFilter = { StorageAreaID: [StorageAreaID] };

  filterImmutableData(dataToFilter, table.name);

  if (dataToFilter.StorageAreaID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const result = await storage_areaModel.update(patchData, {
    where: { StorageAreaID },
  });

  if (result[0] > 0) {
    const updatedRow = await storage_areaModel.findOne({
      where: { StorageAreaID },
    });

    return updatedRow.get({ plain: true });
  }

  const existingRow = await storage_areaModel.findOne({
    where: { StorageAreaID },
  });

  if (!existingRow) {
    throw new AppError(
      `No record found for storage area: ${StorageAreaID}`,
      404,
    );
  }

  return existingRow.get({ plain: true });
};

const deleteStorage_Areas = async (storage_areaModel, storage_areaData) => {
  removeEmptyValues(storage_areaData);

  const keyValuesArr = processKeyValues(
    Object.keys(storage_areaData),
    storage_areaData,
  );

  if (!keyValuesArr || keyValuesArr.length === 0) {
    throw new AppError(
      "Deletion Denied: No valid matching criteria provided.",
      400,
    );
  }

  const options = setDeleteOptions(keyValuesArr, "StorageAreaID");

  const result = await storage_areaModel.destroy({
    where: options,
  });

  if (result === 0) {
    throw new AppError("No matching records found to delete.", 404);
  }

  return {
    deletedRows: result,
    identifiers: storage_areaData,
  };
};

module.exports = {
  getStorage_Areas,
  createStorage_Area,
  updateStorage_Areas,
  patchStorage_Area,
  deleteStorage_Areas,
};
