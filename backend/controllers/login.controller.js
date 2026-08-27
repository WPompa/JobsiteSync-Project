const service = require("../services/login.service");
const asyncWrapper = require("../middleware/asyncWrapper");
const { AppError } = require("../utils/AppError");

const login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body.login;
  const sequelize = req.sequelize;

  if (!username) {
    throw new AppError("Please Provide Username.", 400);
  } else if (!password) {
    throw new AppError("Please Provide Password.", 400);
  }

  const result = await service.login(sequelize, username, password);

  res.status(200).json(result);
});

const authMe = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No Token Provided", 401);
  }

  const jwtToken = authHeader.split(" ")[1];

  if (jwtToken) {
    const result = await service.authMe(jwtToken);

    res.status(200).json(result);
  } else {
    throw new AppError("No Token Provided", 401);
  }
});

module.exports = { login, authMe };
