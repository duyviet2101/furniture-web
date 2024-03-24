const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadSingleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/myAccount.controller.js');

router.get('/', asyncHandler(controller.index));

router.patch('/',
  upload.single('avatar'),
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.avatar = await uploadSingleCloudinaryByBuffer({file: req.file, folder: '/admin/avatar'});
    }
    next();
  }),
  asyncHandler(controller.update)
);

module.exports = router;