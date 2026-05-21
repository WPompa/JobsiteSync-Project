const express = require("express");
const router = express.Router();
const {
  getStored_In,
  createStored_In,
  updateStored_In,
  patchStored_In,
  deleteStored_In,
} = require("../controllers/stored_in.controller");

router
  .route("/storedin")
  .get(getStored_In)
  .post(createStored_In)
  .put(updateStored_In)
  .patch(patchStored_In)
  .delete(deleteStored_In);

module.exports = router;
