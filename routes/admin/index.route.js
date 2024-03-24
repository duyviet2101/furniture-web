const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.route.js'))

router.use(require(`../../middlewares/admin/auth.middleware.js`).requiredAuth)

router.use('/', require('./dashboard.route.js'))
router.use('/dashboard', require('./dashboard.route.js'))

router.use('/products', require('./products.route.js'))

router.use('/myAccount', require('./myAccount.route.js'))

module.exports = router;