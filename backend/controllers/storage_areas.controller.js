const service = require("../services/storage_areas.service");
const asyncWrapper = require("../middleware/asyncWrapper"); //Try Catch wrapper

const getStorage_Areas = asyncWrapper(async (req, res, next) => {
  const { page, limit } = req.query;
  const { storage_areas } = req.models;
  const sequelize = req.sequelize;

  const { result, metadata } = await service.getStorage_Areas(
    sequelize,
    storage_areas,
    page,
    limit,
  );

  res.status(200).json({ status: "success", result, pagination: metadata });
});

const createStorage_Area = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { storage_areas, activity_logs } = req.models;

  const result = await service.createStorage_Area(
    storage_areas,
    activity_logs,
    body,
    req.user,
  );

  //console.log(JSON.stringify(result));
  res
    .status(201)
    .json({ status: "success", result, message: "Storage Area Created!" });
});

const updateStorage_Areas = asyncWrapper(async (req, res, next) => {
  const { body, useEmpty } = req.body;
  const { storage_areas, activity_logs } = req.models;

  const result = await service.updateStorage_Areas(
    storage_areas,
    activity_logs,
    body,
    useEmpty,
    req.user,
  );

  if (result === null) {
    return res.status(204).send();
  }

  res
    .status(200)
    .json({ status: "success", result, message: "Storage Area(s) Updated!" });
});

const patchStorage_Area = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { storage_areas, activity_logs } = req.models;

  const result = await service.patchStorage_Area(
    storage_areas,
    activity_logs,
    id,
    req.body,
    req.user,
  );

  res
    .status(200)
    .json({ status: "success", result, message: "Storage Area Updated!" });
});

const deleteStorage_Areas = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { storage_areas, activity_logs } = req.models;

  const result = await service.deleteStorage_Areas(
    storage_areas,
    activity_logs,
    body,
    req.user,
  );

  res
    .status(200)
    .json({ status: "success", result, message: "Storage Area(s) Deleted!" });
});

module.exports = {
  getStorage_Areas,
  createStorage_Area,
  updateStorage_Areas,
  patchStorage_Area,
  deleteStorage_Areas,
};
