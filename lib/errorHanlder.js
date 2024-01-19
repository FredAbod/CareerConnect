const { default: AppError } = require("./appError");


const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const value = err.message.match(/(["'])(.*?[^\\])\1/); // ((["'])(.*?[^\\])\1*
  const message = `Duplicate field value: ${value}. Please use another.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please login again!", 401);
const handleJWTExpiredError = () =>
  new AppError("Expired token. Please login again!", 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API -- A
  if (req.originalUrl.startsWith("/api")) {
    // 1. Operational, trusted error: send message to client
    if (err.isOperational) {
      // console.log(err);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // 2. Programming or other unknown error: don't leak error details
    // a. Log error to the console
    console.log("Error 🔥🔥 ", err);

    // b. Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    //console.log({error});
    error.message = err.message;
    let dupErorr = error.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (dupErorr.includes("E11000")) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "UnauthorizedError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
