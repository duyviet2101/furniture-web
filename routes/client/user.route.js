const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/user.controller.js');

router.get('/', asyncHandler(controller.index));

router.get('/edit', asyncHandler(controller.edit));

router.patch('/edit', asyncHandler(controller.patchEdit));

router.get('/orders/:orderId', asyncHandler(controller.orderDetail));

module.exports = router;