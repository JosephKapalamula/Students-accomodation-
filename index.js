const express = require("express");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const ratelimit = require("express-rate-limit");
const mongosanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyParser = require("body-parser");

// app.use(mongosanitize());data sanitization against nosql query injection
// app.use(xss()); //data sanitization aganins malicous code XSS
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

//limit request from same api route
// const limiter = ratelimit({
//     max: 100,
//     windoMs: 60 * 60 * 1000, // 1hr,
//     message: "too many requests per hour please try in an hour",
//   });
//   app.use("/api", limiter);

//Routes
const userRoutes = require("./routes/userRoutes"); //userRoutes
const institutionRoutes = require("./routes/institutionRoutes"); //institutionRoutes
const roomRoutes = require("./routes/roomRoutes"); //roomRoutes
const transactionRoutes = require("./routes/transactionRoutes"); //transactionRoutes
const paymentRoutes = require("./routes/paymentRoutes"); //paymentRoutes
const adminRoutes = require("./routes/adminRoutes"); //adminRoutes

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/institution", institutionRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

module.exports = app;
