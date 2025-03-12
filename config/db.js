const mongoose = require("mongoose");

const db = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB...`);
    } catch (error) {
        console.log(`Connection error : ${error.message}`);
        process.exit(1);
    }
}

module.exports = db;