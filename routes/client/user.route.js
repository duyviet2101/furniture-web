const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/user.controller.js');

router.get('/', asyncHandler(controller.index));

module.exports = router;