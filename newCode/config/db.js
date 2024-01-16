const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async ()=>{
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("connected to database");
    } catch (error) {
      console.log(error.message);
      console.log("error connecting to database");
  
    }
  }

  module.exports = connectDB;
