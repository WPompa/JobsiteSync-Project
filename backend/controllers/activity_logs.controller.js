const service = require("../services/activity_logs.service");
const asyncWrapper = require("../middleware/asyncWrapper");

const getActivity_Logs = asyncWrapper(async (req, res, next) => {
  const { page, limit } = req.query;
  const { activity_logs } = req.models;
  const sequelize = req.sequelize;

  const { result, metadata } = await service.getActivity_Logs(
    sequelize,
    activity_logs,
    page,
    limit,
  );

  res.status(200).json({ status: "success", result, pagination: metadata });
});

module.exports = { getActivity_Logs };
