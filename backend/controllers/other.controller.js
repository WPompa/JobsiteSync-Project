const service = require("../services/other.service");
const asyncWrapper = require("../middleware/asyncWrapper"); //Try Catch wrapper

const getOther = asyncWrapper(async (req, res, next) => {
  const { table, page, limit } = req.query;
  const sequelize = req.sequelize;

  const { result, metadata } = await service(sequelize, table, page, limit);

  res.status(200).json({ status: "success", result, pagination: metadata });
});

module.exports = getOther;
