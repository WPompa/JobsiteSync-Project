"use strict";
const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./middleware/dbConnection");
const auth = require("./middleware/auth");
const { connectToDB, sequelize } = require("./config/connect");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

require("dotenv").config();

const allowedOrigins = [process.env.FRONTEND_URL, process.env.DEV_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      //console.log("Allowed Origin: ", origin); //Comment out when testing

      callback(null, true);
    } else {
      console.log("Blocked Origin: ", origin);

      callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"],
};

//from express-rate-limit with a few changes.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

///// Middleware /////
app.use(express.json());

app.use(helmet());

app.use(limiter);

app.use(cors(corsOptions));

app.use(dbConnection);

///// Routes /////
const baseRoute = "/api/v1/";

const login = require("./routes/login.routes");
app.use("/", login);

const employees = require("./routes/employees.routes");
app.use(baseRoute, auth, employees);

const materials = require("./routes/materials.routes");
app.use(baseRoute, auth, materials);

const jobsites = require("./routes/jobsites.routes");
app.use(baseRoute, auth, jobsites);

const storage_areas = require("./routes/storage_areas.routes");
app.use(baseRoute, auth, storage_areas);

const stored_in = require("./routes/stored_in.routes");
app.use(baseRoute, auth, stored_in);

const activity_logs = require("./routes/activity_logs.routes");
app.use(baseRoute, auth, activity_logs);

const other = require("./routes/other");
app.use(baseRoute, auth, other);

const notFound = require("./routes/notFound");
app.use("/{*any}", notFound);

///// Error Handler /////
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

///////////////////////////////////////////////////

//For development
/* let serverInstance; */

/* async function start() {
  //uncomment here for dev//
  try {
    // await connectToDB();
    // await sequelize.authenticate();
    console.log("Connected to the MySQL database.");
    //serverInstance =
    app.listen(8081, () => {
      console.log("Server listening...");
    });
  } catch (error) {
    console.log(error);
    console.log("Server Initialization Aborted.");
  }
} */ //uncomment here for dev//

/* const shutdown = () => {
  console.log("Shutting down...");
  serverInstance.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
}; */

//start(); //uncomment here for dev//

/* console.log("models: ");
console.log(sequelize.models); */

module.exports = app;
