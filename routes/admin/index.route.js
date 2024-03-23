const express = require('express');
const router = express.Router();

router.use('/', require('./dashboard.route.js'))
router.use('/dashboard', require('./dashboard.route.js'))

router.use('/products', require('./products.route.js'))

module.exports = router;