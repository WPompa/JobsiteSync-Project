"use strict";
const express = require("express");
const router = express.Router();
const { AppError } = require("../utils/AppError");
const { login, authMe } = require("../controllers/login.controller");

router.route("/login").post(login);
router.route("/auth").get(authMe);

module.exports = router;
