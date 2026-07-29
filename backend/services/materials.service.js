const { AppError } = require("../utils/AppError");
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
  name: "materials",
  primaryKeys: ["MaterialID"],
};

const getMaterials = async (materialModel, currentPage, currentLimit) => {
  const totalCount = await materialModel.count();

  const { offset, limit, metadata } = getPagination(
    currentPage,
    currentLimit,
    totalCount,
  );

  const result = await materialModel.findAll({
    /* attributes: [
      "MaterialID",
      "Name",
      ["MaterialType", "Mat. Type"],
      ["Length", "Box Length"],
      ["Width", "Box Width"],
      ["Height", "Box Height"],
      ["SupplierName", "Supplier"],
      ["TotalAvailable", "Available"],
      ["LostAmounts", "Trashed"],
    ], */
    offset,
    limit,
  });

  //If pagination works as intended this snippet might never be used.
  if (!result || result.length === 0) {
    throw new AppError("No Data For Selected Page", 404);
  }

  return { result, metadata };
};

const createMaterial = async (
  materialModel,
  activity_logsModel,
  materialData,
  user,
) => {
  const required = ["Name", "MaterialType", "SupplierName"];

  checkForRequiredValues(required, materialData);

  removeEmptyValues(materialData);

  //If Primary key value is given, check if it is already in use.
  if (materialData?.MaterialID) {
    const [instanceObj, isCreated] = await materialModel.findOrCreate({
      where: { MaterialID: materialData.MaterialID },
      defaults: materialData,
    });

    if (!isCreated) {
      console.log(
        `Material With ID "${materialData.MaterialID}" Already Exists!`,
      );
      throw new AppError(
        `Material With ID "${materialData.MaterialID}" Already Exists!`,
        409,
      );
    }

    await createActivity_Log(activity_logsModel, {
      ActionType: "CREATE",
      MaterialName: `${materialData.MaterialName}-${materialData.MaterialID}`,
      StorageLocation: "",
      JobsiteName: "",
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });

    return instanceObj.get({ plain: true });
  }

  const result = await materialModel.create(materialData); //{fields: []} to exclude injected key-values.

  await createActivity_Log(activity_logsModel, {
    ActionType: "CREATE",
    MaterialName: `${result.MaterialName}-${result.MaterialID}`,
    StorageLocation: "",
    JobsiteName: "",
    QuantityChanged: 0,
    HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
  });

  return result.get({ plain: true });
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateMaterials = async (
  materialModel,
  activity_logsModel,
  materialData,
  useEmpty,
  user,
) => {
  const required = ["MaterialID"];

  checkForRequiredValues(required, materialData);

  removeEmptyValues(materialData, useEmpty);

  const primaryKeyValuesArr = processKeyValues(
    table.primaryKeys,
    materialData,
    true,
  );

  filterImmutableData(primaryKeyValuesArr, table.name);

  if (primaryKeyValuesArr[0].MaterialID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const options = setUpdateOptions(table.primaryKeys, primaryKeyValuesArr);

  await materialModel.update(materialData, {
    where: options,
  });

  const updatedRows = await materialModel.findAll({
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
      StorageLocation: "",
      JobsiteName: "",
      QuantityChanged: updatedRows.length,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });

    return null;
  }

  const promisesArr = updatedRows.map((row) =>
    createActivity_Log(activity_logsModel, {
      ActionType: "UPDATE",
      MaterialName: `${row.MaterialName}-${row.MaterialID}`,
      StorageLocation: "",
      JobsiteName: "",
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    }),
  );

  await Promise.all(promisesArr);

  return updatedRows;
};

const patchMaterial = async (
  materialModel,
  activity_logsModel,
  MaterialID,
  patchData,
  user,
) => {
  delete patchData.MaterialID;

  if (!patchData || Object.keys(patchData).length === 0) {
    throw new AppError("Body cannot be empty.", 400);
  }

  const dataToFilter = { MaterialID: [MaterialID] };

  filterImmutableData(dataToFilter, table.name);

  if (dataToFilter.MaterialID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const result = await materialModel.update(patchData, {
    where: { MaterialID },
  });

  if (result[0] > 0) {
    const updatedRow = await materialModel.findOne({ where: { MaterialID } });

    await createActivity_Log(activity_logsModel, {
      ActionType: "PATCH",
      MaterialName: `${updatedRow.MaterialName}-${updatedRow.MaterialID}`,
      StorageLocation: "",
      JobsiteName: "",
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });

    return updatedRow.get({ plain: true });
  }

  const existingRow = await materialModel.findOne({ where: { MaterialID } });

  if (!existingRow) {
    throw new AppError(`No record found for material: ${MaterialID}`, 404);
  }

  return existingRow.get({ plain: true });
};

const deleteMaterials = async (
  materialModel,
  activity_logsModel,
  materialData,
  user,
) => {
  removeEmptyValues(materialData);

  const keyValuesArr = processKeyValues(
    Object.keys(materialData),
    materialData,
  );

  if (!keyValuesArr || keyValuesArr.length === 0) {
    throw new AppError(
      "Deletion Denied: No valid matching criteria provided.",
      400,
    );
  }

  const options = setDeleteOptions(keyValuesArr, "MaterialID");

  const result = await materialModel.destroy({
    where: options,
  });

  if (result === 0) {
    throw new AppError("No matching records found to delete.", 404);
  }

  const materials =
    keyValuesArr.find((obj) => obj.MaterialID)?.MaterialID || [];
  const totalItems = materials.length;
  const promisesArr = [];

  if (result >= 25) {
    createActivity_Log(activity_logsModel, {
      ActionType: "DELETE",
      MaterialName: "Many Materials",
      StorageLocation: "",
      JobsiteName: "",
      QuantityChanged: result,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });
  } else {
    for (let i = 0; i < totalItems; i++) {
      promisesArr.push(
        createActivity_Log(activity_logsModel, {
          ActionType: "DELETE",
          MaterialName: materials[i] || "NO ID",
          StorageLocation: "",
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
    identifiers: materialData,
  };
};

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterials,
  patchMaterial,
  deleteMaterials,
};
