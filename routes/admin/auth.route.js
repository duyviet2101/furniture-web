const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/auth.controller.js');

router.get('/login', asyncHandler(controller.login));

router.post('/login', asyncHandler(controller.postLogin));

module.exports = router;