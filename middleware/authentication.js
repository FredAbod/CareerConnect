const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Authentication failed" });

    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.decoded = decoded;
    if (!decoded)
      return res.status(401).json({ message: "Authentication failed" });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = isAuthenticated;
