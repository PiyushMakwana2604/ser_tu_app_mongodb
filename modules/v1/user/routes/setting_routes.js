const express = require('express')

const router = express.Router()
const settingController = require('../controller/setting_controllers');

router.post('/delete-user', settingController.delete_user);

router.post('/change-password', settingController.change_password);

router.get('/faq-list', settingController.faq_list);

router.get('/terms-and-about-us', settingController.terms_and_about_us);


module.exports = router;
