const express = require('express');
const router = express.Router();

const {getInfoUser} = require('../../middlewares/client/user.middleware.js');
const {requiredAuth} = require('../../middlewares/client/auth.middleware.js');
const categoryMiddleware = require('../../middlewares/client/category.middleware.js');
const cartMiddleware = require('../../middlewares/client/cart.middleware.js');
// const {pushLogToTelegram} = require('../../middlewares/index.js');

// router.use(pushLogToTelegram);

router.use(getInfoUser);

router.use(categoryMiddleware);

router.use(cartMiddleware.checkCart);

router.use('/', require('./home.route.js'));

router.use('/auth', require('./auth.route.js'));

router.use('/products', require('./products.route.js'));

router.use('/cart', require('./cart.route.js'));

router.use('/checkout', require('./checkout.route.js'));

router.use('/user', requiredAuth, require('./user.route.js'));

module.exports = router;