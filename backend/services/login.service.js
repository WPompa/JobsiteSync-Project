const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");

const login = async (sequelize, username, password) => {
  const result = await sequelize.query(
    `SELECT AccountID, Username FROM credentials WHERE username = :username AND password = :password`,
    {
      replacements: { username, password },
      type: QueryTypes.SELECT,
    },
  );

  if (username === "Guest" && password === "password") {
    const token = jwt.sign(
      { AccountID: -1, username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return { status: "success", result: true, token };
  }

  if (result.length !== 1) {
    return { status: "error", result: false, token: null };
  }

  const user = result[0];

  const token = jwt.sign(
    { AccountID: user.AccountID, username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return { status: "success", result: true, token };
};

// Does not return promise. The controller is async to handle errors like the other controllers.
const authMe = (jwtToken) => {
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { AccountID, username } = decoded;

  if (AccountID && username) {
    return { status: "success", result: true, username };
  } else {
    return { status: "error", result: false, username: "N/A" };
  }
};

module.exports = { login, authMe };
