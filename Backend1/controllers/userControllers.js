const News = require("../models/news.models.js");
const User = require("../models/user.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName && !password) {
      return res
        .status(400)
        .json({ message: "Please input username and password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ userName, password: hashedPassword });
    await user.save();

    //Generate JWT Token
    const token = jwt.sign(
      { payload: { userId: user._id, userName: userName } },
      process.env.SECRETKEY,
      { expiresIn: "10h" }
    );

    res
      .status(201)
      .json({ message: "User created Succesfully", user: user, token: token });
  } catch (error) {
    res.status(500).json({ message: "Error Registering User", error: error });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }
    res.status(200).json({ message: "User logged in", user: user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error });
  }
};

const postNews = async (req, res) => {
  try {
    const {userName} = req.decoded
    const { headline, body, robot } = req.body;
    const article = new News({
      headline,
      body,
      userName,
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

module.exports = { postNews, getNews, signUp, login };
