const express = require('express');
const router = express.Router();


const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/rbac.controller.js');

const { grantAccess } = require('../../middlewares/admin/rbac.middleware.js');

router.get('/roles', grantAccess('readAny', 'Roles'), asyncHandler(controller.roles));

router.get('/roles/create', grantAccess('createAny', 'Roles'), asyncHandler(controller.createRoles));

router.post('/roles/create', grantAccess('createAny', 'Roles'), asyncHandler(controller.postCreateRoles));

router.get('/roles/edit/:id', grantAccess('updateAny', 'Roles'), asyncHandler(controller.editRoles));

router.patch('/roles/edit/:id', grantAccess('updateAny', 'Roles'), asyncHandler(controller.patchEditRoles));

router.delete('/roles/delete/:id', grantAccess('deleteAny', 'Roles'), asyncHandler(controller.deleteRoles));

router.get('/roles/permissions', grantAccess('readAny', 'Roles'), asyncHandler(controller.permissions));

router.get('/resources/create', grantAccess('createAny', 'Resources'), asyncHandler(controller.createResources));

router.post('/resources/create', grantAccess('createAny', 'Resources'), asyncHandler(controller.postCreateResources));

router.patch('/roles/permissions', grantAccess('updateAny', 'Roles'), asyncHandler(controller.updatePermissions));

// router.get('/getGrants', asyncHandler(controller.getGrants));

module.exports = router;