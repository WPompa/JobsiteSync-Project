const { AppError } = require("../utils/AppError");
const { QueryTypes } = require("sequelize");
const tables = require("../utils/RawQueries");
const getPagination = require("../utils/paginationHelper");

const table = {
  name: "activity_logs",
  primaryKeys: ["LogID"],
};

const getActivity_Logs = async (
  sequelize,
  activity_logModel,
  currentPage,
  currentLimit,
) => {
  const totalCount = await activity_logModel.count();

  const { offset, limit, metadata } = getPagination(
    currentPage,
    currentLimit,
    totalCount,
  );

  const result = await activity_logModel.findAll({
    limit,
    offset,
    order: [["LogID", "DESC"]],
  });

  if (!result || result.length === 0) {
    throw new AppError("No Data For Selected Page", 404);
  }

  return { result, metadata };
};

// Some logs will get the wrong string since the properties only check for specifics (i.e a delete not using IDs or names)
// Note that this form of logging is too simple for the project. It will need a future rework & potentially a logging table for each main table.
const createActivity_Log = async (activity_logsModel, logData) => {
  return await activity_logsModel.create({
    ActionType: logData?.ActionType || "MISSING_ACTION",
    MaterialName: logData?.MaterialName ?? null,
    StorageLocation: logData?.StorageLocation ?? null,
    JobsiteName: logData?.JobsiteName ?? null,
    QuantityChanged: logData?.QuantityChanged || 0,
    HandledBy: logData?.HandledBy || "MISSING_ID",
  });
};

module.exports = { getActivity_Logs, createActivity_Log };
