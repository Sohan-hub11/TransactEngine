const accountModel = require('../models/account.model');


async function createAccountController(req, res){
  const user = req.user; // Get the authenticated user from the request object.

  const account = await accountModel.create({
    user: user._id, // Associate the new account with the authenticated user's ID.
  })

  res.status(201).json({ message: "Account created successfully", account });
}


module.exports = { createAccountController };