const {generateToken} = require("../../utils/generateToken");
const { tryCatch } = require("../../utils/tryCatch");
const authServices = require("./services");
const { User } = require("../../Models/user");

exports.SignUp = tryCatch(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter All the User Fields");
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User Already Exists");
    }
    const newUserDetails = { name, email, password, isAdmin};
  
    const createdUser = await UserModel.create(newUserDetails);
  
    if (!createdUser) {
      res.status(404);
      throw new Error("User Not Found");
    }
  
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser._id),
    });
});

exports.SignIn = tryCatch(async (req, res) => {
  const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      res.status(400);
      throw new Error("Invalid request params for user login");
    }
  
    // Find a user with the entered email
    const user = await User.findOne({ email });
    // Check if a user with entered email exists and check if entered password
    // matches the stored user password
    if (user && (await user.matchPasswords(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin : user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
});

exports.getUserData = tryCatch(async (req, res) => {
  const userId = req.params.id;
  const foundUser = await User.findOne({ _id: userId });

  const data = {
    userEmail: foundUser.email,
  };

  res.status(200).json(data).end();
});

exports.adminStatus = tryCatch(async (req, res) => {
  const userId = req.params.id;
  const isAdmin = await authServices.adminCheck(userId);

  res.status(200).json(isAdmin).end();
});
