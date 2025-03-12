const express = require("express");
const mealController = require('./controllers');
const verifyJWT = require("../../middleware/verifyJWT");
const checkAdmin = require("../../middleware/adminCheck");

const router = express.Router();

router.post("/setMeals", verifyJWT, checkAdmin, mealController.createMeal);
router.get("/getMeals", verifyJWT, mealController.getMeals);

module.exports = router;
