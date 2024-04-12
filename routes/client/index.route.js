const express = require('express');
const router = express.Router();

const {getInfoUser} = require('../../middlewares/client/user.middleware.js');
const categoryMiddleware = require('../../middlewares/client/category.middleware.js');

router.use(getInfoUser);

router.use(categoryMiddleware);

router.use('/', require('./home.route.js'));

router.use('/auth', require('./auth.route.js'));

router.use('/products', require('./products.route.js'));

module.exports = router;