const express = require("express");
const paymentController = require('./controllers')
const verifyJWT = require("../../middleware/verifyJWT");

const router = express.Router();

router.post("/initiate", verifyJWT, paymentController.initiatePayment);
router.post("/", verifyJWT, paymentController.paymentStatus);

module.exports = router;
