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

  //console.log(username + password); // Only for debugging purposes.

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

module.exports = login;
