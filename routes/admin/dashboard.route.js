const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/dashboard.controller.js');

router.get('/', asyncHandler(controller.index));

module.exports = router;