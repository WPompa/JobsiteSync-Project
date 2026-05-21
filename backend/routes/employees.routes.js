const express = require("express");
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  updateEmployees,
  patchEmployee,
  deleteEmployees,
} = require("../controllers/employees.controller");

router
  .route("/employees")
  .get(getEmployees)
  .post(createEmployee)
  .put(updateEmployees)
  .delete(deleteEmployees);

router.route("/employees/:id").patch(patchEmployee);

module.exports = router;
