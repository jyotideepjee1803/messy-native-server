const express = require("express");
const dayController = require('./controllers');
const verifyJWT = require("../../middleware/verifyJWT");
const checkAdmin = require('../../middleware/adminCheck');

const router = express.Router();

//Auth based routes
router.post("/setMenu", verifyJWT, checkAdmin, dayController.createMenu);
router.get("/getMenu", verifyJWT, dayController.getDays);

module.exports = router;
