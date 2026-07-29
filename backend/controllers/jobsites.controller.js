const service = require("../services/jobsites.service");
const asyncWrapper = require("../middleware/asyncWrapper"); //Try Catch wrapper

const getJobsites = asyncWrapper(async (req, res, next) => {
  const { page, limit } = req.query;
  const { jobsites } = req.models;
  const sequelize = req.sequelize;

  const { result, metadata } = await service.getJobsites(
    sequelize,
    jobsites,
    page,
    limit,
  );

  res.status(200).json({ status: "success", result, pagination: metadata });
});

const createJobsite = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { jobsites, activity_logs } = req.models;

  const result = await service.createJobsite(
    jobsites,
    activity_logs,
    body,
    req.user,
  );

  res
    .status(201)
    .json({ status: "success", result, message: "Jobsite Created!" });
});

const updateJobsites = asyncWrapper(async (req, res, next) => {
  const { body, useEmpty } = req.body;
  const { jobsites, activity_logs } = req.models;

  const result = await service.updateJobsites(
    jobsites,
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
    .json({ status: "success", result, message: "Jobsite(s) Updated!" });
});

const patchJobsite = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { jobsites, activity_logs } = req.models;

  const result = await service.patchJobsite(
    jobsites,
    activity_logs,
    id,
    req.body,
    req.user,
  );

  res
    .status(200)
    .json({ status: "success", result, message: "Jobsite Updated!" });
});

const deleteJobsites = asyncWrapper(async (req, res, next) => {
  const { body } = req.body;
  const { jobsites, activity_logs } = req.models;

  const result = await service.deleteJobsites(
    jobsites,
    activity_logs,
    body,
    req.user,
  );

  res
    .status(200)
    .json({ status: "success", result, message: "Jobsite(s) Deleted!" });
});

module.exports = {
  getJobsites,
  createJobsite,
  updateJobsites,
  patchJobsite,
  deleteJobsites,
};
