const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
const tokenBlackListModel = require('../models/blacklist.model');


/**
* - user registration controller
* - POST /api/auth/register
*/
async function userRegistrationController(req, res) { 
  const { email, name, password } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  })

  if(isExist) {
    return res.status(422).json({
      status: "failed",
      message: "User already exists with this email",
    })
  }

  const user = await userModel.create({
    name,
    email,
    password,
  })
  
  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
    expiresIn: "3d",
  })

  res.cookie("token", token);

  // Send registration email in the background
  emailService
    .sendRegistrationEmail(user.email, user.name)
    .catch(err => console.error("Email failed:", err));

  return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      });
}

/**
* - user login controller
* - POST /api/auth/login
*/
async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password"); // Explicitly select the password field since it's excluded by default in the user schema.

  if(!user) {
    return res.status(401).json({
      status: "failed",
      message: "email or password is invalid",
    })
  }

  const isValidPassword = await user.comparePassword(password);

  if(!isValidPassword) {
    return res.status(401).json({
      status: "failed",
      message: "email or password is invalid",
    })
  }

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
    expiresIn: "3d",
  })

  res.cookie("token", token);

  return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      });
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
 async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if(!token) {
    return res.status(400).json({
      status: "failed",
      message: "No token provided",
    })
  }

  // Add the token to the blacklist
  await tokenBlackListModel.create({ token: token });

  res.clearCookie("token");

  return res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  })
}


module.exports = {
  userRegistrationController, userLoginController, userLogoutController
};

