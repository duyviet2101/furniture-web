const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/cart.controller.js');

router.post('/add', asyncHandler(controller.addToCart));

module.exports = router;