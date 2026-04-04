const userModel = require('../models/user.model');

/**
* - user registration controller
* - POST /api/auth/register
*/
function userRegistrationController(req, res) { 
  const { email, name, password } = req.body;

  const isExist = userModel.findOne({
    email: email,
  })

  if(isExist) {
    return res.status(422).json({
      status: "failed",
      message: "Email already exists."
    })
  }

}

module.exports = {
  userRegistrationController,
};

