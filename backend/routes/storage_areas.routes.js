const express = require("express");
const router = express.Router();
const {
  getStorage_Areas,
  createStorage_Area,
  updateStorage_Areas,
  patchStorage_Area,
  deleteStorage_Areas,
} = require("../controllers/storage_areas.controller");

router
  .route("/storageareas")
  .get(getStorage_Areas)
  .post(createStorage_Area)
  .put(updateStorage_Areas)
  .delete(deleteStorage_Areas);

router.route("/storageareas/:id").patch(patchStorage_Area);

module.exports = router;
