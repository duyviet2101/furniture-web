const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadMultipleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/products.controller.js');

router.get('/', asyncHandler(controller.index));

router.get('/create', asyncHandler(controller.create));

router.post('/create',
  upload.array('thumbnail', 10),
  asyncHandler(async (req, res, next) => {
    if (req.files) {
      req.body.thumbnail = await uploadMultipleCloudinaryByBuffer({files: req.files, folder: '/admin/products'});
    }
    next();
  }),
  asyncHandler(controller.postCreate)
);

module.exports = router;