const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/handleError.js');
const {grantAccess} = require('../../middlewares/admin/rbac.middleware.js');
const controller = require('../../controllers/admin/accounts.controller.js');

router.get('/', grantAccess('readAny', 'Accounts'), asyncHandler(controller.index));

module.exports = router;