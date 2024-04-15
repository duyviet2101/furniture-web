const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/orders.controller.js');

//! kiểm soát phân quyền
const { grantAccess } = require('../../middlewares/admin/rbac.middleware.js');
//! end kiểm soát phân quyền

router.get('/', grantAccess('readAny', 'Orders'), asyncHandler(controller.index));

router.patch('/status/:id/:status', grantAccess('updateAny', 'Orders'), asyncHandler(controller.status));

router.patch('/change-multi', grantAccess('updateAny', 'Orders'), asyncHandler(controller.changeMulti));

module.exports = router;