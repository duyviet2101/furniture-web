const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadSingleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/upload.controller.js');

router.post('/',
  upload.single('file'),
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.location = await uploadSingleCloudinaryByBuffer({file: req.file, folder: '/admin/upload'});
    }
    next();
  }),
  asyncHandler(controller.postUpload)
);

module.exports = router;