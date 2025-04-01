require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require('./config/db');

const app = express();

const userRoutes = require("./apis/users/routes");
const dayRoutes = require("./apis/days/routes");
const mealRoutes = require("./apis/meals/routes");
const couponRoutes = require("./apis/coupons/routes");
const paymentRoutes = require("./apis/payments/routes");
const noticeRoutes = require("./apis/notices/routes");

const PORT = process.env.PORT || 5000;

const frontendURI = "http://localhost:5173";

db();

app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from any origin
      callback(null, true);
    },
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Welcome to the Messy API!");
});
app.use("/users", userRoutes);
app.use("/days", dayRoutes);
app.use("/meals", mealRoutes);
app.use("/coupons", couponRoutes);
app.use("/payments", paymentRoutes);
app.use("/notices", noticeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
