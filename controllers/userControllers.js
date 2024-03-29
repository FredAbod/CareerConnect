const News = require("../models/news.models.js");
const User = require("../models/user.models.js");
const cloudinary = require("../image/cloudinary.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const otpGenerator = require("otp-generator");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const { errorResMsg, successResMsg } = require("../lib/response.js");

dotenv.config();

//?: User
const signUp = async (req, res) => {
  const { userName, password, email } = req.body;
  if (!userName && !password && !email) {
    return errorResMsg(res, 500, "Please input username, password and email");
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResMsg(res, 500, "User Already exists");
    }
    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    //? Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      password: hashedPassword,
      email,
      otp,
    });
    await user.save();
    //Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY, {
      expiresIn: "10h",
    });
    // Set a timeout to delete the OTP after one minute
    setTimeout(async () => {
      // Remove OTP from the user document
      user.otp = undefined;
      await user.save();
      console.log("OTP deleted after one minute.");
    }, 12000); // 12000 milliseconds = 2 minute

    // Replace these values with your own
    const senderEmail = process.env.SENDER_EMAIL; // Sender's email address
    const recipientEmail = email; // Recipient's email address
    const smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL, // Your email address
        pass: process.env.PASSWORD, // Your email password or app-specific password
      },
    };

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Email content
    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: "Test Email from Node.js",
      text: `Hello, this is a test email sent from a Career Connect app using Nodemailer!, And here is Your Otp ${otp}, otp expires after one minute`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error:", error.message);
      }
      console.log("Email sent:", info.response);
    });

    return successResMsg(res, 201, { data: user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Registering User", error: error });
  }
};

const verify = async (req, res) => {
  try {
    const { otp } = req.body;

    // Assuming your User model has an 'otp' field
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(400).json({ message: "INVALID OTP" });
    }

    // Assuming your User model has an 'isVerified' field
    user.isVerified = true;

    // Save the changes to the user object
    await user.save();

    res.status(200).json({ message: "User Verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified === false) {
      return res.status(400).json({ message: "User not Verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY, {
      expiresIn: "10h",
    });
    res.status(200).json({ message: "User logged in", user: user, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error });
  }
};

//upload Profile Picture
const uploadPicture = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return errorResMsg(res, 400, "User not found");
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const updateUser = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { profilePic: result.secure_url },
      {
        isNew: true,
      }
    );
    return successResMsg(res, 200, { data: updateUser });
  } catch (error) {
    console.log(error);
    return errorResMsg(res, 500, error.message, {
      message: "internal server error",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a new 6-digit OTP
    const newOtp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    // Update the user's OTP
    user.otp = newOtp;
    await user.save();

    // Set a timeout to delete the new OTP after one minute
    setTimeout(async () => {
      // Remove the new OTP from the user document
      user.otp = undefined;
      await user.save();
      console.log("New OTP deleted after one minute.");
    }, 12000); // 12000 milliseconds = 2 minute

    const senderEmail = process.env.SENDER_EMAIL;
    const recipientEmail = email;
    const smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL, // Your email address
        pass: process.env.PASSWORD, // Your email password or app-specific password
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: "Resend OTP from Node.js",
      text: `Hello, this is a resend OTP email sent from a Career Connect app using Nodemailer! Your new OTP is ${newOtp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error:", error.message);
      }
      console.log("Resend OTP Email sent:", info.response);
    });

    res.status(200).json({ message: "OTP resent successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending OTP", error });
  }
};

const postNews = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const user = await User.findById(userId);
    if (user.role !== "admin") {
      return errorResMsg(res, 401, "You are UnAuthorized");
    }
    const { headline, body, userName, robot } = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);

    const article = new News({
      headline,
      body,
      image: result.secure_url,
      robot,
    });
    await article.save();
    res
      .status(201)
      .json({ message: "Article created Succesfully", newNews: article });
  } catch (error) {
    res.status(500).json({ message: "Article Not Created", error: error });
  }
};

const getNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json({ message: "All Article Fetched", news: news });
  } catch (error) {
    res.status(500).json({ message: "News Not Found", error: error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Generate a unique reset token and set expiry time (e.g., 10 minutes)
    const resetToken = uuid.v4();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 10);

    //update user with reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const senderEmail = process.env.SENDER_EMAIL;
    const recipientEmail = email;
    const smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL, // Your email address
        pass: process.env.PASSWORD, // Your email password or app-specific password
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const resetLink = `http://localhost:${PORT}/reset-password/${resetToken}`;
    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: "Reset Password",
      text: `Hello, this is your link to reset your password ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error:", error.message);
      }
      console.log("Reset Password", info.response);
    });

    res.status(200).json({ message: "Reset link successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error Sending Reset Link", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password Does Not Match" });
    }

    // Find user with the given reset token and within the expiry time
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.status(200).json({ message: "Password Reset Succesfull1y", user });
  } catch (error) {
    res.status(500).json({ message: "Error Resetting Password", error });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const { userName, email } = req.body;

    const newUser = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      { userName: userName, email: email },
      { isNew: true }
    );
    return successResMsg(res, 200, {
      message: "User Profile Updated Successfully",
      newUser,
    });
  } catch (error) {
    return errorResMsg(error, 500, { message: "User Profile Not Updated" });
  }
};

const deleteUser = async(req, res) => {
try {
  const { userId} = req.decoded;
  const deletedUser = await User.findByIdAndDelete({_id: userId});
  return successResMsg(res, 200, { message: "User deleted successfully", deletedUser})
} catch (error) {
  console.log(error);
  return errorResMsg(res, 500, { message: "User Not Deleted" });

}
}

module.exports = {
  postNews,
  getNews,
  signUp,
  login,
  verify,
  resendOtp,
  forgotPassword,
  resetPassword,
  uploadPicture,
  updateProfile,
  deleteUser,
};
