const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/checkout.controller.js');

router.get('/', asyncHandler(controller.index));

router.post('/', asyncHandler(controller.order));

module.exports = router;