const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/auth.controller.js');

router.get('/signup', asyncHandler(controller.signup));

router.post('/signup', asyncHandler(controller.postSignup));

router.get('/login', asyncHandler(controller.login));

router.post('/login', asyncHandler(controller.postLogin));

module.exports = router;