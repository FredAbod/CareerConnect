const { errorResMsg, successResMsg } = require("../lib/response");
const Admin = require("../models/admin.models");
const bcrypt = require("bcrypt");

exports.adminSignUp = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const existingAdmin = await Admin.findOne({email});
    if (existingAdmin) {
      return errorResMsg(res, 403, "Admin Already Exists");
    }
    if (!userName || !password) {
      return errorResMsg(res, 500, "Please enter Username or Password");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({userName, password: hashPassword, email});
    newAdmin.save();
    return successResMsg(res, 201, {message: "Added a new Admin", newAdmin});
  } catch (error) {
    return errorResMsg(res, 500, "Could not save admin", error);

  }
};
