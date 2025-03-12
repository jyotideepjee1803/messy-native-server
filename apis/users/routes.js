const express = require("express");
const authController = require("./controllers");
const verifyJWT = require("../../middleware/verifyJWT");

const router = express.Router();

//Auth based routes
router.post("/signUp", authController.SignUp);
router.post("/signIn", authController.SignIn);

router.get("/adminCheck/:id", verifyJWT, authController.adminStatus);
router.get("/getUser/:id", verifyJWT, authController.getUserData);

module.exports = router;
