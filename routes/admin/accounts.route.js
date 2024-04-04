const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadSingleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const {grantAccess} = require('../../middlewares/admin/rbac.middleware.js');
const controller = require('../../controllers/admin/accounts.controller.js');

router.get('/', grantAccess('readAny', 'Accounts'), asyncHandler(controller.index));

router.get('/create', grantAccess('createAny', 'Accounts'), asyncHandler(controller.create));

router.post('/create', 
  grantAccess('createAny', 'Accounts'),
  upload.single('avatar'),
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.avatar = await uploadSingleCloudinaryByBuffer({file: req.file, folder: '/admin/avatar'});
    }
    next();
  }),
  asyncHandler(controller.postCreate)
);

module.exports = router;