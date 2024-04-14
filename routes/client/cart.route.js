const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/cart.controller.js');

router.get('/', asyncHandler(controller.index));

router.post('/add', asyncHandler(controller.addToCart));

router.delete('/remove/:productId', asyncHandler(controller.removeFromCart));

router.patch('/update/', asyncHandler(controller.updateCart));

module.exports = router;