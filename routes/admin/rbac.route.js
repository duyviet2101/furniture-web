const express = require('express');
const router = express.Router();


const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/rbac.controller.js');

const { grantAccess } = require('../../middlewares/admin/rbac.middleware.js');

router.get('/roles', grantAccess('readAny', 'roles'), asyncHandler(controller.roles));

router.get('/roles/create', asyncHandler(controller.createRoles));

router.post('/roles/create', asyncHandler(controller.postCreateRoles));

router.get('/roles/permissions', asyncHandler(controller.permissions));

router.get('/resources/create', asyncHandler(controller.createResources));

router.post('/resources/create', asyncHandler(controller.postCreateResources));

router.patch('/roles/permissions', asyncHandler(controller.updatePermissions));

module.exports = router;