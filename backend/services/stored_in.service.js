const { AppError } = require("../utils/AppError");
const { QueryTypes } = require("sequelize");
const tables = require("../utils/RawQueries");
const { createActivity_Log } = require("./activity_logs.service");
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
  [{ Count: totalCount }] = await sequelize.query(tables[table.name].count(), {
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
  const result = await sequelize.query(tables[table.name].query(), {
    replacements: { limit, offset },
    type: QueryTypes.SELECT,
  });

  //If pagination works as intended this snippet might never be used.
  if (!result || result.length === 0) {
    throw new AppError("No Data For Selected Page", 404);
  }

  return { result, metadata };
};

const createStored_In = async (
  stored_inModel,
  activity_logsModel,
  stored_inData,
  user,
) => {
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

    await createActivity_Log(activity_logsModel, {
      ActionType: "CREATE",
      MaterialName: stored_inData?.MaterialID,
      StorageLocation: stored_inData?.StorageAreaID,
      JobsiteName: "",
      QuantityChanged: stored_inData?.Amount,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });
    return instanceObj.get({ plain: true });
  }

  //Because the IDs are required, the row should be created above and never here.
  /* const result = await stored_inModel.create(stored_inData); //{fields: []} to exclude injected key-values.

  return result.get({ plain: true }); */
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateStored_In = async (
  stored_inModel,
  activity_logsModel,
  stored_inData,
  useEmpty,
  user,
) => {
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

  if (updatedRows.length >= 25) {
    await createActivity_Log(activity_logsModel, {
      ActionType: "UPDATE",
      MaterialName: "Many Materials",
      StorageLocation: "Many Locations",
      JobsiteName: "",
      QuantityChanged: updatedRows.length,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });
    return null;
  }

  const promisesArr = updatedRows.map((row) =>
    createActivity_Log(activity_logsModel, {
      ActionType: "UPDATE",
      MaterialName: row.MaterialID,
      StorageLocation: row.StorageAreaID,
      JobsiteName: "",
      QuantityChanged: row.Amount,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    }),
  );

  await Promise.all(promisesArr);

  return updatedRows;
};

const patchStored_In = async (
  stored_inModel,
  activity_logsModel,
  IDs,
  patchData,
  user,
) => {
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

    await createActivity_Log(activity_logsModel, {
      ActionType: "PATCH",
      MaterialName: IDs.MaterialID,
      StorageLocation: IDs.StorageAreaID,
      JobsiteName: "",
      QuantityChanged: patchData?.Amount || -1,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });
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

const deleteStored_In = async (
  stored_inModel,
  activity_logsModel,
  stored_inData,
  user,
) => {
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

  console.log(options);

  const result = await stored_inModel.destroy({
    where: options,
  });

  if (result === 0) {
    throw new AppError("No authorized matching records found to delete.", 404);
    /* throw new AppError("No matching records found to delete.", 404);
     // Use if there is no check for protected data */
  }

  const materials =
    keyValuesArr.find((obj) => obj.MaterialID)?.MaterialID || [];
  const storageAreas =
    keyValuesArr.find((obj) => obj.StorageAreaID)?.StorageAreaID || [];
  const totalItems = Math.max(materials.length, storageAreas.length);
  const promisesArr = [];

  if (result >= 25) {
    createActivity_Log(activity_logsModel, {
      ActionType: "DELETE",
      MaterialName: "Many Materials",
      StorageLocation: "Many Locations",
      JobsiteName: "",
      QuantityChanged: result,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });
  } else {
    for (let i = 0; i < totalItems; i++) {
      promisesArr.push(
        createActivity_Log(activity_logsModel, {
          ActionType: "DELETE",
          MaterialName: materials[i],
          StorageLocation: storageAreas[i],
          JobsiteName: "",
          QuantityChanged: 0,
          HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
        }),
      );
    }
  }

  await Promise.all(promisesArr);

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
