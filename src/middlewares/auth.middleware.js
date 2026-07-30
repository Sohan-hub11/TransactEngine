const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.header.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access: No token provided" });
  }

  const isBlacklisted = await tokenBlackListModel.findOne({ token: token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access: Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);

    const user = await userModel.findById(decoded.userId);
    // console.log("Found User:", user);

    // const users = await userModel.find();
    // console.log("All Users:", users);

    req.user = user; // Attach user information to the request object for downstream use.
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access: Invalid token" });
  }
}

async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  const isBlacklisted = await tokenBlackListModel.findOne({ token: token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access: Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId).select("+systemUser");
    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden access, not a System user",
      });
    }

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}

module.exports = { authMiddleware, authSystemUserMiddleware };
