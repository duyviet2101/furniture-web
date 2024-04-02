const express = require('express');
const router = express.Router();


const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/rbac.controller.js');

router.get('/roles', asyncHandler(controller.roles));

router.get('/roles/create', asyncHandler(controller.createRoles));

router.post('/roles/create', asyncHandler(controller.postRoles));

module.exports = router;