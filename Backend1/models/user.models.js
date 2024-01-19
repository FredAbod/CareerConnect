const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    role: {type: String, default: "user"}
  },{
    versionKey: false
  });
  
module.exports = mongoose.model("User", userSchema);
  