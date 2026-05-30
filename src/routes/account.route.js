const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const accountController = require('../controllers/account.controller');

const router = express.Router();



/**
 * - POST /api/accounts/
 * - Create a New Account for the Authenticated User.
 * - Protected Route.
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);





module.exports = router;

