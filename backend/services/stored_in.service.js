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
  name: "stored_in",
  primaryKeys: ["StorageAreaID", "MaterialID"],
};

const getStored_In = async (
  sequelize,
  stored_inModel,
  currentPage,
  currentLimit,
) => {
  //const totalCount = await stored_inModel.count();
  [{ Count: totalCount }] = await sequelize.query(tables[table.name].count, {
    type: QueryTypes.SELECT,
  });

  const { offset, limit, metadata } = getPagination(
    currentPage,
    currentLimit,
    totalCount,
  );

  /* const result = await stored_inModel.findAll({
    attributes: ["StorageAreaID", "MaterialID", "Amount"],
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

const createStored_In = async (stored_inModel, stored_inData) => {
  const required = ["StorageAreaID", "MaterialID", "Amount"];

  checkForRequiredValues(required, stored_inData);

  //removeEmptyValues(stored_inData); //Required Array is checked for everything already in this case.

  //If Primary key value is given, check if it is already in use.
  if (stored_inData?.StorageAreaID && stored_inData?.MaterialID) {
    const [instanceObj, isCreated] = await stored_inModel.findOrCreate({
      where: {
        StorageAreaID: stored_inData.StorageAreaID,
        MaterialID: stored_inData.MaterialID,
      },
      defaults: stored_inData,
    });

    if (!isCreated) {
      console.log(
        `Stored In With IDs "${stored_inData?.StorageAreaID}-${stored_inData?.MaterialID}" Already Exists!`,
      );
      throw new AppError(
        `Stored In With IDs "${stored_inData?.StorageAreaID}-${stored_inData?.MaterialID}" Already Exists!`,
        409,
      );
    }

    return instanceObj.get({ plain: true });
  }

  //Because the IDs are required, the row should be created above and never here.
  /* const result = await stored_inModel.create(stored_inData); //{fields: []} to exclude injected key-values.

  return result.get({ plain: true }); */
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateStored_In = async (stored_inModel, stored_inData, useEmpty) => {
  const required = ["StorageAreaID", "MaterialID"];

  checkForRequiredValues(required, stored_inData);

  removeEmptyValues(stored_inData, useEmpty);

  const primaryKeyValuesArr = processKeyValues(
    table.primaryKeys,
    stored_inData,
    true,
  );

  filterImmutableData(primaryKeyValuesArr, table.name);

  if (primaryKeyValuesArr[0].StorageAreaID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const options = setUpdateOptions(table.primaryKeys, primaryKeyValuesArr);

  await stored_inModel.update(stored_inData, {
    where: options,
  });

  const updatedRows = await stored_inModel.findAll({
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

const patchStored_In = async (stored_inModel, IDs, patchData) => {
  if (!patchData || Object.keys(patchData).length === 0) {
    throw new AppError("Body cannot be empty.", 400);
  }

  const dataToFilter = {
    StorageAreaID: [IDs?.StorageAreaID],
    MaterialID: [IDs?.MaterialID],
  };

  filterImmutableData(dataToFilter, table.name);

  if (dataToFilter.StorageAreaID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const result = await stored_inModel.update(patchData, {
    where: IDs,
  });

  if (result[0] > 0) {
    const updatedRow = await stored_inModel.findOne({ where: IDs });

    return updatedRow.get({ plain: true });
  }

  const existingRow = await stored_inModel.findOne({ where: IDs });

  if (!existingRow) {
    throw new AppError(
      `No record found for stored in: ${IDs?.StorageAreaID}-${IDs?.MaterialID}`,
      404,
    );
  }

  return existingRow.get({ plain: true });
};

const deleteStored_In = async (stored_inModel, stored_inData) => {
  removeEmptyValues(stored_inData);

  const keyValuesArr = processKeyValues(
    Object.keys(stored_inData),
    stored_inData,
  );

  if (!keyValuesArr || keyValuesArr.length === 0) {
    throw new AppError(
      "Deletion Denied: No valid matching criteria provided.",
      400,
    );
  }

  const options = setDeleteOptions(keyValuesArr, [
    "StorageAreaID",
    "MaterialID",
  ]);

  const result = await stored_inModel.destroy({
    where: options,
  });

  if (result === 0) {
    throw new AppError("No matching records found to delete.", 404);
  }

  return {
    deletedRows: result,
    identifiers: stored_inData,
  };
};

module.exports = {
  getStored_In,
  createStored_In,
  updateStored_In,
  patchStored_In,
  deleteStored_In,
};
