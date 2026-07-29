const service = require("../services/materials.service");
const asyncWrapper = require("../middleware/asyncWrapper"); //Try Catch wrapper

const getMaterials = asyncWrapper(async (req, res, next) => {
  const { page, limit } = req.query;
  const { materials } = req.models;

  const { result, metadata } = await service.getMaterials(
    materials,
    page,
    limit,
  );

  res.status(200).json({ status: "success", result, pagination: metadata });
});

const createMaterial = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { materials, activity_logs } = req.models;

  const result = await service.createMaterial(
    materials,
    activity_logs,
    body,
    req.user,
  );

  res
    .status(201)
    .json({ status: "success", result, message: "Material Created!" });
});

const updateMaterials = asyncWrapper(async (req, res, next) => {
  const { body, useEmpty } = req.body;
  const { materials, activity_logs } = req.models;

  const result = await service.updateMaterials(
    materials,
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
    .json({ status: "success", result, message: "Material(s) Updated!" });
});

const patchMaterial = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { materials, activity_logs } = req.models;

  const result = await service.patchMaterial(
    materials,
    activity_logs,
    id,
    req.body,
    req.user,
  );

  res
    .status(200)
    .json({ status: "success", result, message: "Material Updated!" });
});

const deleteMaterials = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { materials, activity_logs } = req.models;

  const result = await service.deleteMaterials(
    materials,
    activity_logs,
    body,
    req.user,
  );

  res
    .status(200)
    .json({ status: "success", result, message: "Material(s) Deleted!" });
});

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterials,
  patchMaterial,
  deleteMaterials,
};
