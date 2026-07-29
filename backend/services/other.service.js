const { QueryTypes } = require("sequelize");
const { AppError } = require("../utils/AppError");
const getPagination = require("../utils/paginationHelper");
const tables = require("../utils/RawQueries");

const getOther = async (sequelize, tableName, currentPage, currentLimit) => {
  //Will return [ { Count: <number> } ]
  [{ Count: totalCount }] = await sequelize.query(tables[tableName].count(), {
    type: QueryTypes.SELECT,
  });

  const { offset, limit, metadata } = getPagination(
    currentPage,
    currentLimit,
    totalCount,
  );

  const result = await sequelize.query(tables[tableName].query(), {
    replacements: { limit, offset },
    type: QueryTypes.SELECT,
  });

  //If pagination works as intended this snippet might never be used.
  if (!result || result.length === 0) {
    throw new AppError("No Data For Selected Page", 404);
  }

  return { result, metadata };
};

module.exports = getOther;
