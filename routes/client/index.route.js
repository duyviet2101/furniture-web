const express = require('express');
const router = express.Router();

router.use('/', require('./home.route.js'))

module.exports = router;