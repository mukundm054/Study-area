
const mongoose = require("mongoose");
require("dotenv").config()
const url = process.env.DataBase_URL

const connect = async () => {
    try {
        await mongoose.connect(url);
        console.log("Database is connected");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

module.exports = { connect };