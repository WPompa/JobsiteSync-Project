"use strict";
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/AppError");

const authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No Token Provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    //decoded.username. decoded will have accessable properties.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { AccountID, username } = decoded;

    req.user = { AccountID, username };
    next();
  } catch (error) {
    console.error(error.name);
    throw new AppError("Not Authorized", 401);
  }
};

module.exports = authentication;
