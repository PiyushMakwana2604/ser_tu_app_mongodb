const express = require('express');

const router = express.Router();
const middleware = require('../../middleware/headerValidator');

const userRoutes = require('./user/routes/user_routes')

const homeRoutes = require('./user/routes/home_routes')

const settingRoutes = require('./user/routes/setting_routes')

router.use('/', middleware.extractHeaderLanguage);

router.use('/', middleware.validateHeaderApiKey);

router.use('/', middleware.validateHeaderToken);

router.use('/user-auth/', userRoutes);

router.use('/user-home/', homeRoutes);

router.use('/user-setting/', settingRoutes);

module.exports = router;