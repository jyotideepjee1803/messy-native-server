const bcrypt = require("bcrypt");
const { User } = require("../../Models/user");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const signUp = async (name, email, password) => {
  const newUser = new User({
    name: name,
    email: email,
    password: password,
    refreshtoken: "",
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  const tokens = newUser.generateAuthToken();
  newUser.refreshtoken = tokens.refreshtoken;
  await newUser.save();
  
  const data = {
    token: tokens,
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    isAdmin: newUser.isAdmin,
  };

  return data;
};

const signIn = async (user, newRefreshTokenArray) => {
  const token = user.generateAuthToken();

  user.refreshtoken = [...newRefreshTokenArray, token.refreshtoken];

  await user.save();
  const data = {
    token: token,
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };

  return data;
};

const adminCheck = async(id) => {
  const UserData = await User.findById(id)
  return UserData.isAdmin
}

module.exports = {
  signUp,
  signIn,
  adminCheck
};
