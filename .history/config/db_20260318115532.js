const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sourabhsogani94_db_user:test123@cluster0.de1mlyt.mongodb.net/mydatabase?retryWrites=true&w=majority");
        console.log("Database connected");
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;