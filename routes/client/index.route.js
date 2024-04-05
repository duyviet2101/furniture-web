const express = require('express');
const router = express.Router();

const {getInfoUser} = require('../../middlewares/client/user.middleware.js');

router.use(getInfoUser);

router.use('/', require('./home.route.js'));

router.use('/auth', require('./auth.route.js'));

module.exports = router;