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
  name: "jobsites",
  primaryKeys: ["JobsiteID"],
};

const getJobsites = async (
  sequelize,
  JobsiteModel,
  currentPage,
  currentLimit,
) => {
  //const totalCount = await JobsiteModel.count();
  [{ Count: totalCount }] = await sequelize.query(tables[table.name].count(), {
    type: QueryTypes.SELECT,
  });

  const { offset, limit, metadata } = getPagination(
    currentPage,
    currentLimit,
    totalCount,
  );

  /* const result = await JobsiteModel.findAll({
    attributes: ["JobsiteID", ["JobsiteName", "Jobsite"]],
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

const createJobsite = async (
  JobsiteModel,
  activity_logsModel,
  JobsiteData,
  user,
) => {
  const required = ["JobsiteName"];

  checkForRequiredValues(required, JobsiteData);

  removeEmptyValues(JobsiteData);

  //If Primary key value is given, check if it is already in use.
  if (JobsiteData?.JobsiteID) {
    const [instanceObj, isCreated] = await JobsiteModel.findOrCreate({
      where: { JobsiteID: JobsiteData.JobsiteID },
      defaults: JobsiteData,
    });

    if (!isCreated) {
      console.log(`Jobsite With ID "${JobsiteData.JobsiteID}" Already Exists!`);
      throw new AppError(
        `Jobsite With ID "${JobsiteData.JobsiteID}" Already Exists!`,
        409,
      );
    }

    await createActivity_Log(activity_logsModel, {
      ActionType: "CREATE",
      MaterialName: "",
      StorageLocation: "",
      JobsiteName: `${JobsiteData.JobsiteName}-${JobsiteData.JobsiteID}`,
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });

    return instanceObj.get({ plain: true });
  }

  const result = await JobsiteModel.create(JobsiteData); //{fields: []} to exclude injected key-values.

  await createActivity_Log(activity_logsModel, {
    ActionType: "CREATE",
    MaterialName: "",
    StorageLocation: "",
    JobsiteName: `${result.JobsiteName}-${result.JobsiteID}`,
    QuantityChanged: 0,
    HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
  });

  return result.get({ plain: true });
};

//useEmpty is an object with booleans used for flagging values that should be set to null.
const updateJobsites = async (
  JobsiteModel,
  activity_logsModel,
  JobsiteData,
  useEmpty,
  user,
) => {
  const required = ["JobsiteID"];

  checkForRequiredValues(required, JobsiteData);

  removeEmptyValues(JobsiteData, useEmpty);

  const primaryKeyValuesArr = processKeyValues(
    table.primaryKeys,
    JobsiteData,
    true,
  );

  filterImmutableData(primaryKeyValuesArr, table.name);

  if (primaryKeyValuesArr[0].JobsiteID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const options = setUpdateOptions(table.primaryKeys, primaryKeyValuesArr);

  await JobsiteModel.update(JobsiteData, {
    where: options,
  });

  const updatedRows = await JobsiteModel.findAll({
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
      StorageLocation: "",
      JobsiteName: "Many Jobsites",
      QuantityChanged: updatedRows?.length,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });

    return null;
  }

  const promisesArr = updatedRows.map((row) =>
    createActivity_Log(activity_logsModel, {
      ActionType: "UPDATE",
      MaterialName: "",
      StorageLocation: "",
      JobsiteName: `${row.JobsiteName}-${row.JobsiteID}`,
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    }),
  );

  await Promise.all(promisesArr);

  return updatedRows;
};

const patchJobsite = async (
  JobsiteModel,
  activity_logsModel,
  JobsiteID,
  patchData,
  user,
) => {
  delete patchData?.JobsiteID;

  if (!patchData || Object.keys(patchData).length === 0) {
    throw new AppError("Body cannot be empty.", 400);
  }

  const dataToFilter = { JobsiteID: [JobsiteID] };

  filterImmutableData(dataToFilter, table.name);

  if (dataToFilter.JobsiteID.length === 0) {
    throw new AppError("Cannot modify starter data!", 400);
  }

  const result = await JobsiteModel.update(patchData, {
    where: { JobsiteID },
  });

  if (result[0] > 0) {
    const updatedRow = await JobsiteModel.findOne({ where: { JobsiteID } });

    await createActivity_Log(activity_logsModel, {
      ActionType: "PATCH",
      MaterialName: "",
      StorageLocation: "",
      JobsiteName: `${updatedRow.JobsiteName}-${updatedRow.JobsiteID}`,
      QuantityChanged: 0,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });

    return updatedRow.get({ plain: true });
  }

  const existingRow = await JobsiteModel.findOne({ where: { JobsiteID } });

  if (!existingRow) {
    throw new AppError(`No record found for jobsite: ${JobsiteID}`, 404);
  }

  return existingRow.get({ plain: true });
};

const deleteJobsites = async (
  JobsiteModel,
  activity_logsModel,
  JobsiteData,
  user,
) => {
  removeEmptyValues(JobsiteData);

  const keyValuesArr = processKeyValues(Object.keys(JobsiteData), JobsiteData);

  if (!keyValuesArr || keyValuesArr.length === 0) {
    throw new AppError(
      "Deletion Denied: No valid matching criteria provided.",
      400,
    );
  }

  const options = setDeleteOptions(keyValuesArr, "JobsiteID");

  const result = await JobsiteModel.destroy({
    where: options,
  });

  if (result === 0) {
    throw new AppError("No matching records found to delete.", 404);
  }

  const jobsites = keyValuesArr.find((obj) => obj.JobsiteID)?.JobsiteID || [];
  const totalItems = jobsites.length;
  const promisesArr = [];

  if (result >= 25) {
    createActivity_Log(activity_logsModel, {
      ActionType: "DELETE",
      MaterialName: "",
      StorageLocation: "",
      JobsiteName: "Many Jobsites",
      QuantityChanged: result,
      HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
    });
  } else {
    for (let i = 0; i < totalItems; i++) {
      promisesArr.push(
        createActivity_Log(activity_logsModel, {
          ActionType: "DELETE",
          MaterialName: "",
          StorageLocation: "",
          JobsiteName: jobsites[i] || "NO ID",
          QuantityChanged: 0,
          HandledBy: `${user?.username || "NO USERNAME"}-${user?.AccountID || "NO ID"}`,
        }),
      );
    }
  }

  await Promise.all(promisesArr);

  return {
    deletedRows: result,
    identifiers: JobsiteData,
  };
};

module.exports = {
  getJobsites,
  createJobsite,
  updateJobsites,
  patchJobsite,
  deleteJobsites,
};
