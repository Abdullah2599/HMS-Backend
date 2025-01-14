const mongoose = require("mongoose");
require("dotenv").config();
const DB_hotel = async () => {
    await mongoose.connect(process.env.DB).then((res) => {
        console.log("database connected!");
    }).catch((err) => {
        console.log("error: " + err)
    })
} 

module.exports=DB_hotel;