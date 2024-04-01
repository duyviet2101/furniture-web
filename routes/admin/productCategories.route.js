const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadSingleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/productCategories.controller.js');

router.get('/', asyncHandler(controller.index));

router.get('/create', asyncHandler(controller.create));

router.post('/create',
  upload.single('thumbnail'),
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.thumbnail = await uploadSingleCloudinaryByBuffer({file: req.file, folder: '/admin/product-categories'});
    }
    next();
  }),
  asyncHandler(controller.postCreate)
);

router.delete('/delete/:id', asyncHandler(controller.delete));

module.exports = router;