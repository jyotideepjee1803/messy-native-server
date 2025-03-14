const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_SECRET_KEY);
};
