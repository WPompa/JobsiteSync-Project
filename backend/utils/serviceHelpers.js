const { AppError } = require("../utils/AppError");
const { Op } = require("sequelize");

//Check for empty strings. The model validators will validate.
const checkForRequiredValues = (required, modelData) => {
  for (let i = required.length - 1; i >= 0; i--) {
    const key = required[i];

    if (modelData[key] !== "") {
      required.splice(i, 1);
    }
  }

  if (required.length > 0) {
    throw new AppError(`Required Values: ${required}`, 400);
  }
};

//Empty values outside of the required can be deleted.
const removeEmptyValues = (modelData, useEmpty = {}) => {
  for (let key in modelData) {
    if (modelData[key] === "" && useEmpty?.[key] !== true) {
      delete modelData[key];
    } else if (useEmpty?.[key] === true) {
      modelData[key] = null;
    }
  }
};

//Creates {[Key]: [value1, value2, ...]} from multiple entries per Key.
//returns [ { key1: [valuesArr] }, { key2: [valuesArr] }, ... ]
//Used in creating options for model.update() & model.destroy().
//"hasPK" is used for "keys" that are primary keys with multiple entries. Do not mix with non-primary keys.
const processKeyValues = (keys, modelData, hasPK = false) => {
  let keyValuesArr = [];

  keys.forEach((key) => {
    keyValuesArr.push({
      [key]: modelData[key]
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
    });

    /* 
    Note to self: you no longer have any local reference tracking tags on employeeData itself with 'delete modelData[key]'. 
    If you need to log or output exactly which keys failed vs which keys succeeded, or 
    if you need to pass employeeData to secondary utility logs down the line, its pk identifier context is gone. */
    if (hasPK) {
      delete modelData[key];
    }
  });

  return keyValuesArr;
};

const setUpdateOptions = (
  primaryKeys,
  primaryKeyValuesArr,
  Op = require("sequelize").Op,
) => {
  let options = {};

  // Single Primary key
  if (primaryKeys.length === 1) {
    const primaryKey = primaryKeys[0];

    options[primaryKey] = { [Op.or]: primaryKeyValuesArr[0][primaryKey] };
    return options;
  }

  // Begin handling Composite Primary keys
  const sampleKey = primaryKeys[0];
  const totalRows = primaryKeyValuesArr[0][sampleKey].length;
  const rowClauses = [];

  for (let i = 0; i < totalRows; i++) {
    const singleRowCondition = {};

    // Pairs the i-th StorageAreaID with the i-th MaterialID
    primaryKeys.forEach((key, keyIndex) => {
      singleRowCondition[key] = primaryKeyValuesArr[keyIndex][key][i];
    });

    rowClauses.push(singleRowCondition);
  }

  // Pair composite keys in a top-level OR block
  options = { [Op.or]: rowClauses };

  return options;
};

const setDeleteOptions = (
  keyValuesArr,
  primaryKeyParam,
  Op = require("sequelize").Op,
) => {
  const immutableData = {
    EmpID: 13,
    MaterialID: 4,
    StorageAreaID: 4,
    JobsiteID: 2,
  };

  let options = {};

  const keysToProtect = Array.isArray(primaryKeyParam)
    ? primaryKeyParam
    : [primaryKeyParam];

  // Composite key
  if (keysToProtect.length > 1) {
    // [{StorageAreaID:[5,6]}, {MaterialID:[6,5]}] into {StorageAreaID:[5,6], MaterialID:[6,5]}
    const criteria = Object.assign({}, ...keyValuesArr);

    const sampleKey = keysToProtect[0];
    const totalRowsToClear = criteria[sampleKey]?.length || 0;
    const rowMatchClauses = [];

    // Pair up coordinates by index to build isolated exact row matches
    // [{StorageAreaID: 1, MaterialID:1}, {...}, ...]
    for (let i = 0; i < totalRowsToClear; i++) {
      const singleRowCondition = {};

      keysToProtect.forEach((pk) => {
        singleRowCondition[pk] = criteria[pk][i];
      });

      rowMatchClauses.push(singleRowCondition);
    }

    // Wrap row queries in an Op.or if multiple rows exist, otherwise unwrap
    const matchCondition =
      rowMatchClauses.length === 1
        ? rowMatchClauses[0]
        : { [Op.or]: rowMatchClauses };

    // Build explicit safety boundaries for each primary key
    const protectionClauses = [];

    keysToProtect.forEach((pk) => {
      if (immutableData[pk] !== undefined) {
        protectionClauses.push({ [pk]: { [Op.gt]: immutableData[pk] } });
      }
    });

    options = {
      [Op.and]: [matchCondition, ...protectionClauses],
    };

    return options;
  }

  // Single primary key
  const [keyValueObj] = keyValuesArr;
  const [currentKey] = Object.keys(keyValueObj);
  const targetValues = keyValueObj[currentKey];

  const matchCondition = { [currentKey]: { [Op.in]: targetValues } };
  const protectionClauses = [];

  keysToProtect.forEach((pk) => {
    if (immutableData[pk] !== undefined) {
      protectionClauses.push({ [pk]: { [Op.gt]: immutableData[pk] } });
    }
  });

  if (protectionClauses.length > 0) {
    options = {
      [Op.and]: [matchCondition, ...protectionClauses],
    };

    return options;
  }

  options = matchCondition;

  return options;
};

// This function is just to always have example data during a live showcase.
// Check if a request is trying to modify the starter data. Filter "immutable values".
// inputData => {[Key]: [value1, value2, ...]} i.e {EmpID : [1, 2 ,3 ...]}, can also be [ {[Key]: [value1, value2, ...]} ]
const filterImmutableData = (inputData, table) => {
  const immutableDataIDs = {
    employees: 13,
    materials: 4,
    storage_areas: 4,
    jobsites: 2,
    stored_in: 4,
  };

  // Composite Keys, only stored_in for now
  if (table === "stored_in") {
    // If it's an array from processKeyValues, turn it into an object reference map
    const IDsObject = Array.isArray(inputData)
      ? Object.assign({}, ...inputData)
      : inputData;

    const maxLimit = immutableDataIDs.stored_in;
    const storageAreaIDs = IDsObject.StorageAreaID || [];
    const materialIDs = IDsObject.MaterialID || [];

    // IDs for rows that are ok to change.
    const safeStorageAreaIDs = [];
    const safeMaterialIDs = [];

    storageAreaIDs.forEach((storageAreaID, index) => {
      const relatedMaterialID = materialIDs[index];

      if (!(storageAreaID <= maxLimit && relatedMaterialID <= maxLimit)) {
        safeStorageAreaIDs.push(storageAreaID);

        safeMaterialIDs.push(relatedMaterialID);
      }
    });

    IDsObject.StorageAreaID = safeStorageAreaIDs;
    IDsObject.MaterialID = safeMaterialIDs;

    return;
  }

  // Other single primary key tables
  if (Array.isArray(inputData)) {
    // Mutate each item object directly inside the processKeyValues array (inputData)
    inputData.forEach((item) => {
      const [key] = Object.keys(item);
      const values = item[key];

      if (!Array.isArray(values)) return;

      const maxLimit = immutableDataIDs[table];
      const safeValues = values.filter((value) => value > maxLimit);

      item[key] = safeValues;
    });
  } else if (inputData && typeof inputData === "object") {
    // Fallback for single row PATCH requests
    Object.entries(inputData).forEach(([key, values]) => {
      if (!Array.isArray(values)) return;

      const maxLimit = immutableDataIDs[table];
      const safeValues = values.filter((val) => val > maxLimit);
      inputData[key] = safeValues;
    });
  }

  //could add return/appError here to alert the function was called but nothing was mutated.
};

module.exports = {
  checkForRequiredValues,
  removeEmptyValues,
  processKeyValues,
  setUpdateOptions,
  setDeleteOptions,
  filterImmutableData,
};
