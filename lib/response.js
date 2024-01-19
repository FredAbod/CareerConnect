/**
 * Send an error JSON
 * @param res - response object
 * @param code - status code
 * @param message - error message
 * @returns {Object} - JSON response
 */
const errorResMsg = (res, code, message) =>
  res.status(code).json({
    status: "error",
    message: message,
  });

/**
 * Success JSON to be sent
 * @param res - response Object
 * @param code - status code
 * @param responseData - data to be sent, it requires a message object
 * @returns {Object} - JSON response
 */
const successResMsg = (res, code, responseData) => {
  const { message, ...data } = responseData;
  return res.status(code).json({
    status: "success",
    message,
    data,
  });
};

const redirect = (res, url) => res.status(302).redirect(url);

module.exports = { errorResMsg, successResMsg, redirect };
