const express = require("express");
const router = express.Router();
const {
  getMaterials,
  createMaterial,
  updateMaterials,
  patchMaterial,
  deleteMaterials,
} = require("../controllers/materials.controller");

router
  .route("/materials")
  .get(getMaterials)
  .post(createMaterial)
  .put(updateMaterials)
  .delete(deleteMaterials);

router.route("/materials/:id").patch(patchMaterial);

module.exports = router;
