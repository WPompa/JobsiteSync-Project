const service = require("../services/stored_in.service");
const asyncWrapper = require("../middleware/asyncWrapper"); //Try Catch wrapper

const getStored_In = asyncWrapper(async (req, res, next) => {
  const { page, limit } = req.query;
  const { stored_in } = req.models;
  const sequelize = req.sequelize;

  const { result, metadata } = await service.getStored_In(
    sequelize,
    stored_in,
    page,
    limit,
  );

  res.status(200).json({ status: "Success!", result, pagination: metadata });
});

const createStored_In = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { stored_in } = req.models;

  const result = await service.createStored_In(stored_in, body);

  res.status(201).json({ status: "Success!", result });
});

const updateStored_In = asyncWrapper(async (req, res, next) => {
  const { body, useEmpty } = req.body;
  const { stored_in } = req.models;

  const result = await service.updateStored_In(stored_in, body, useEmpty);

  if (result === null) {
    return res.status(204).send();
  }

  res.status(200).json({ status: "Success!", result });
});

const patchStored_In = asyncWrapper(async (req, res, next) => {
  const { stored_in } = req.models;

  const result = await service.patchStored_In(stored_in, req.query, req.body);

  res.status(200).json({ status: "Success!", result });
});

const deleteStored_In = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { stored_in } = req.models;

  const result = await service.deleteStored_In(stored_in, body);

  res.status(200).json({ status: "Success!", result });
});

module.exports = {
  getStored_In,
  createStored_In,
  updateStored_In,
  patchStored_In,
  deleteStored_In,
};
