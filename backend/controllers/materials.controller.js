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

  res.status(200).json({ status: "Success!", result, pagination: metadata });
});

const createMaterial = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { materials } = req.models;

  const result = await service.createMaterial(materials, body);

  res.status(201).json({ status: "Success!", result });
});

const updateMaterials = asyncWrapper(async (req, res, next) => {
  const { body, useEmpty } = req.body;
  const { materials } = req.models;

  const result = await service.updateMaterials(materials, body, useEmpty);

  if (result === null) {
    return res.status(204).send();
  }

  res.status(200).json({ status: "Success!", result });
});

const patchMaterial = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { materials } = req.models;

  const result = await service.patchMaterial(materials, id, req.body);

  res.status(200).json({ status: "Success!", result });
});

const deleteMaterials = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { materials } = req.models;

  const result = await service.deleteMaterials(materials, body);

  res.status(200).json({ status: "Success!", result });
});

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterials,
  patchMaterial,
  deleteMaterials,
};
