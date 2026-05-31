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
    console.error("Error Message: ", err?.parent?.sqlMessage || err.message);
    console.error("Errors: ", err?.errors);

    let cleanUserMessage = "A database tracking error occurred.";

    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      if (err.name === "SequelizeUniqueConstraintError") {
        cleanUserMessage = `${err.errors[0].path} is already taken. Please try another value.`;
      } else {
        cleanUserMessage = err.errors.map((error) => error.message).join("\n");

        // Alternative layout: "Email is invalid. Password is too short."
        // cleanUserMessage = err.errors.map(error => error.message).join(". ");
      }
    }
    return res.status(400).json({
      status: "error",
      message: cleanUserMessage,
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
