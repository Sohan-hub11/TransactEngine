const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.post('/register', authController.userRegistrationController);


module.exports = router;