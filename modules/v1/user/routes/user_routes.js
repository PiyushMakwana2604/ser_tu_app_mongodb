const express = require('express')

const router = express.Router()
const userController = require('../controller/user_controllers');

router.post('/signup', userController.signup);

router.post('/otp-verification', userController.otp_verification);

router.post('/resend-user-otp', userController.resend_user_otp);

router.post('/login', userController.login);

router.post('/update-password', userController.updatePassword);

router.post('/logout', userController.logout);

module.exports = router;