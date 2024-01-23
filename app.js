const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require('./routes/user.Routes')
const adminRouter = require('./routes/admin.routes')

dotenv.config();
PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Apply the rate limiter middleware to all requests
app.use(limiter);


app.use('/api/user/v1', userRouter)
app.use('/api/admin/v1', adminRouter)

connectDB();


app.get("/", (req, res) => {
  res.send("This is our application Home Page!!!!😁😁😁");
});



app.listen(PORT, async () => {
  console.log(`listening on http://localhost:${PORT}`);
});
