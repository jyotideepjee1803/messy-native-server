const mongoose = require('mongoose')

const daySchema = new mongoose.Schema({
    day : String,
    breakfast : String,
    lunch : String,
    dinner : String
},{versionKey: false});

const Day = mongoose.model("Day", daySchema);

exports.Day = Day;