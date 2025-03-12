const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
   mealName : String,
   startTime: String,
   endTime: String,
   cost : Number
},{versionKey: false});

const Meal = mongoose.model('Meal', mealSchema) 
exports.Meal = Meal