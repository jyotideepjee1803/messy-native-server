const {generateToken} = require("../../utils/generateToken");
const { tryCatch } = require("../../utils/tryCatch");
const authServices = require("./services");
const { User } = require("../../Models/user");
const { OTP } = require("../../Models/otp");
const { putObject } = require("../../config/aws/s3/putObject");
const sendOtpEmail = require("../../utils/sendOTPMail");

exports.registrationOTP = tryCatch(async (req, res) => {
  const {email} = req.body;
  const existingUser = await User.findOne({email});
  if(existingUser){
    res.status(400);
    throw new Error("User Already Exists");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const resp = await OTP.create({email, otp});
  await sendOtpEmail(email, otp);
  res.status(200).json({
    email, otp
  });
})

exports.verfiyEmail = tryCatch(async(req, res) => {
  const {email, otp} = req.body;
  const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);
  if (response.length === 0 || otp !== response[0].otp) {
    return res.status(400).json({
      success: false,
      message: 'The OTP is not valid',
    });
  }

  res.status(200).json({
    email
  });
})

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
  
    const createdUser = await User.create(newUserDetails);
  
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
    if (!email || !password) {
      res.status(400);
      throw new Error("Invalid request params for user login");
    }
  
    // Find a user with the entered email
    const user = await User.findOne({ email });
    // Check if a user with entered email exists and check if entered password
    // matches the stored user password
    if (user && (await user.matchPasswords(password))) {

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const resp = await OTP.create({email, otp});
      await sendOtpEmail(email, otp);

      res.status(200).json({
        message: "OTP sent to your email",
        userId: user._id,
        email,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
});

exports.verifyOtp = tryCatch(async (req, res) => {
  const { userId, otp, email } = req.body;
  if (!userId || !otp) {
    res.status(400);
    throw new Error("Missing OTP or userId");
  }

  const user = await User.findById(userId);
  const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);
  if (response.length === 0 || otp !== response[0].otp) {
    res.status(401);
    throw new Error("Invalid or expired OTP");
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});


exports.updateUser = tryCatch(async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  // Find user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update user details
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  
  await user.save();
  
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });

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

exports.updateFCMToken = tryCatch(async (req, res) => {
  const { userId, fcmToken } = req.body;

  if (!userId || !fcmToken) {
    res.status(400);
    throw new Error("User ID and FCM token are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.fcmToken = fcmToken;
  await user.save();

  res.status(200).json({ message: "FCM token updated successfully" });
});

exports.upload = async(req,res) => {
  try{
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const fileName = `${Date.now()}-${file.originalname}`;
    const result = await putObject(file.buffer, fileName, file.mimetype);

    if (!result) return res.status(500).json({ message: 'Upload failed' });

    res.json({
      message: 'File uploaded successfully!',
      fileUrl: result.url,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}