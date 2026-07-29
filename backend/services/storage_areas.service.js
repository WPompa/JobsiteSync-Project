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
  [{ Count: totalCount }] = await sequelize.query(tables[table.name].count(), {
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

const createStorage_Area = async (
  storage_areaModel,
  activity_logsModel,
  storage_areaData,
  user,
) => {
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

    await createActivity_Log(activity_logsModel, {
      ActionType: "CREATE",
      MaterialName: "",
      StorageLocation: `${storage_areaData.Location}-${storage_areaData.StorageAreaID}`,
      JobsiteName: "",
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });

    return instanceObj.get({ plain: true });
  }

  const result = await storage_areaModel.create(storage_areaData); //{fields: []} to exclude injected key-values.

  await createActivity_Log(activity_logsModel, {
    ActionType: "CREATE",
    MaterialName: "",
    StorageLocation: `${result?.Location}-${result?.StorageAreaID}`,
    JobsiteName: "",
    QuantityChanged: 0,
    HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
  });

  return result.get({ plain: true });
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateStorage_Areas = async (
  storage_areaModel,
  activity_logsModel,
  storage_areaData,
  useEmpty,
  user,
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

  if (updatedRows.length >= 25) {
    await createActivity_Log(activity_logsModel, {
      ActionType: "UPDATE",
      MaterialName: "",
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
      MaterialName: "",
      StorageLocation: `${row?.Location}-${row?.StorageAreaID}`,
      JobsiteName: "",
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    }),
  );

  await Promise.all(promisesArr);

  return updatedRows;
};

const patchStorage_Area = async (
  storage_areaModel,
  activity_logsModel,
  StorageAreaID,
  patchData,
  user,
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

    await createActivity_Log(activity_logsModel, {
      ActionType: "PATCH",
      MaterialName: "",
      StorageLocation: `${updatedRow?.Location}-${updatedRow.StorageAreaID}`,
      JobsiteName: "",
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
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

const deleteStorage_Areas = async (
  storage_areaModel,
  activity_logsModel,
  storage_areaData,
  user,
) => {
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

  const storageAreas =
    keyValuesArr.find((obj) => obj.StorageAreaID)?.StorageAreaID || [];
  const totalItems = storageAreas.length;
  const promisesArr = [];

  if (result >= 25) {
    createActivity_Log(activity_logsModel, {
      ActionType: "DELETE",
      MaterialName: "",
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
          MaterialName: "",
          StorageLocation: storageAreas[i] || "NO ID",
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
