const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRouter = require('./routes/user.Routes')

dotenv.config();
PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use('/api/user/v1', userRouter)

connectDB();


app.get("/", (req, res) => {
  res.send("This is our application Home Page!!!!😁😁😁");
});



app.listen(PORT, async () => {
  console.log(`listening on http://localhost:${PORT}`);
});
