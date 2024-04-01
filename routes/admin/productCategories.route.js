const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadMultipleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/productCategories.controller.js');

router.get('/', asyncHandler(controller.index));

module.exports = router;