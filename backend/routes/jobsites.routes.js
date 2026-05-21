const express = require("express");
const router = express.Router();
const {
  getJobsites,
  createJobsite,
  updateJobsites,
  patchJobsite,
  deleteJobsites,
} = require("../controllers/jobsites.controller");

router
  .route("/jobsites")
  .get(getJobsites)
  .post(createJobsite)
  .put(updateJobsites)
  .delete(deleteJobsites);

router.route("/jobsites/:id").patch(patchJobsite);

module.exports = router;
