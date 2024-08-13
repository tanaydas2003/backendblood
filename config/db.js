const mongoose = require("mongoose");
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to Database ${mongoose.connection.host}`.bgBlack.blue);
    }
    catch (error) {
        console.log(`Database Error ${error}`.bgBlack.white)
    }
};

module.exports = connectDB;