const express = require("express");
const router = express.Router();
const { getActivity_Logs } = require("../controllers/activity_logs.controller");

router.route("/activitylogs").get(getActivity_Logs);

module.exports = router;
