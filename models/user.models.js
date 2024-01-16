const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: String,
    password: String,
    email: { type: String, unique: true },
    otp: String,
    resetToken: String,
    resetTokenExpiry: String,
    isVerified: { type: Boolean, default: "false" },
    role: { type: String, default: "user" },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
