const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  isAdmin: { type: Boolean, required: true, default: false },
});

// Checking if entered password by user during login is authentic
userSchema.methods.matchPasswords = async function (enteredPassword) {
  const ans = await bcrypt.compare(enteredPassword, this.password);
  return ans;
};

userSchema.pre("save", async function (next) {
  // Encrypt the password only if it's modified or created
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
      return;
    } catch (error) {
      next(error);
    }
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  const accesstoken = jwt.sign(
    { _id: this._id },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "10s",
    }
  );
  const refreshtoken = jwt.sign(
    { _id: this._id },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const tokens = { accesstoken: accesstoken, refreshtoken: refreshtoken };
  return tokens;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
