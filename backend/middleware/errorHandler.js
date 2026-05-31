"use strict";
const { AppError } = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    console.error("AppError: ", err.message); // comment out when testing

    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  if (err.name.includes("Sequelize")) {
    console.error("Sequelize Error: ", err.name);
    console.error("Errors: ", err?.errors); //Look into this line. Just gives undefined.
    console.error("Message: ", err?.parent?.sqlMessage);
    console.error("Stack: ", err.stack);

    return res.status(400).json({
      status: "error",
      message: "Internal Sequelize Error", //err.message, //Prone to oversharing. Needs Rework.
      stack: undefined,
    });
  }

  console.log(err);
  //console.log(JSON.stringify(err, null, 2));

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    stack: undefined,
  });
};

module.exports = errorHandler;
