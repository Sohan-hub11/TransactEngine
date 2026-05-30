const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authMiddleware (req, res, next){
  const token = req.cookies.token || req.header.authorization?.split(" ")[1];

  if(!token){
    return res.status(401).json({ message: "Unauthorized Access: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userModel.findById(decoded.userId);
    req.user = user; // Attach user information to the request object for downstream use.
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access: Invalid token" });
  }
}

module.exports = { authMiddleware };