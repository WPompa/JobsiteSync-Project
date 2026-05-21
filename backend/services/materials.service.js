const { AppError } = require("../utils/AppError");
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
  if (result.length === 0) {
    throw new AppError("No Data For Selected Page", 200);
  }

  return { result, metadata };
};

const createMaterial = async (materialModel, materialData) => {
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

    return instanceObj.get({ plain: true });
  }

  const result = await materialModel.create(materialData); //{fields: []} to exclude injected key-values.

  return result.get({ plain: true });
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateMaterials = async (materialModel, materialData, useEmpty) => {
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

  if (updatedRows.length >= 50) {
    return null;
  }

  return updatedRows;
};

const patchMaterial = async (materialModel, MaterialID, patchData) => {
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

    return updatedRow.get({ plain: true });
  }

  const existingRow = await materialModel.findOne({ where: { MaterialID } });

  if (!existingRow) {
    throw new AppError(`No record found for material: ${MaterialID}`, 404);
  }

  return existingRow.get({ plain: true });
};

const deleteMaterials = async (materialModel, materialData) => {
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
