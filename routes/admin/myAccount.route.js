const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/myAccount.controller.js');

router.get('/', asyncHandler(controller.index));

module.exports = router;