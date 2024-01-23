const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userName: String,
    password: String,
    email: { type: String, unique: true },
    role: { type: String, default: "admin" },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
