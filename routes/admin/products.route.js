const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/products.controller.js');

router.get('/', asyncHandler(controller.index));

router.get('/create', asyncHandler(controller.create));

module.exports = router;