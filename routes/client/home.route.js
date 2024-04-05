const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/home.controller.js');
const {requiredAuth} = require('../../middlewares/client/auth.middleware.js');

router.get('/', asyncHandler(controller.index));

module.exports = router;