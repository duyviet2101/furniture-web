const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/client/auth.controller.js');

router.get('/signup', asyncHandler(controller.signup));

router.post('/signup', asyncHandler(controller.postSignup));

router.get('/login', asyncHandler(controller.login));

router.post('/login', asyncHandler(controller.postLogin));

router.get('/logout', asyncHandler(controller.logout));

router.get('/change-password', asyncHandler(controller.changePassword));

router.post('/change-password', asyncHandler(controller.postChangePassword));

module.exports = router;