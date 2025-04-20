const express = require("express");
const authController = require("./controllers");
const verifyJWT = require("../../middleware/verifyJWT");

const router = express.Router();

//Auth based routes
router.post("/signUp", authController.SignUp);
router.post("/signIn", authController.SignIn);
router.post("/verify-otp", authController.verifyOtp);
router.put("/updateUser/:id", verifyJWT, authController.updateUser);
router.get("/adminCheck/:id", verifyJWT, authController.adminStatus);
router.get("/getUser/:id", verifyJWT, authController.getUserData);
router.post("/updateFCMToken", authController.updateFCMToken);

module.exports = router;
