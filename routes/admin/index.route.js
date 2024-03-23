const express = require('express');
const router = express.Router();

router.use('/', require('./dashboard.route.js'))

module.exports = router;