const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    headline: {type: String, unique: true},
    body: String,
    image: String,
    robot: Boolean,
    role: {type: String, default: "user"}
  },{
    versionKey: false
  });
  
module.exports = mongoose.model("News", newsSchema);
  