const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadSingleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const {grantAccess} = require('../../middlewares/admin/rbac.middleware.js')
const controller = require('../../controllers/admin/productCategories.controller.js');

router.get('/', grantAccess('readAny', 'Danh mục sản phẩm'), asyncHandler(controller.index));

router.get('/create', grantAccess('createAny', 'Danh mục sản phẩm'), asyncHandler(controller.create));

router.post('/create',
  grantAccess('createAny', 'Danh mục sản phẩm'),
  upload.single('thumbnail'),
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.thumbnail = await uploadSingleCloudinaryByBuffer({file: req.file, folder: '/admin/product-categories'});
    }
    next();
  }),
  asyncHandler(controller.postCreate)
);

router.delete('/delete/:id', grantAccess('deleteAny', 'Danh mục sản phẩm'), asyncHandler(controller.delete));

router.patch('/status/:id/:status', grantAccess('updateAny', 'Danh mục sản phẩm'), asyncHandler(controller.status));

router.patch('/change-position/:id', grantAccess('updateAny', 'Danh mục sản phẩm'), asyncHandler(controller.changePosition));

router.get('/edit/:id', grantAccess('updateAny', 'Danh mục sản phẩm'), asyncHandler(controller.edit));

router.patch('/edit/:id',
  grantAccess('updateAny', 'Danh mục sản phẩm'),
  upload.single('thumbnail'),
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.thumbnail = await uploadSingleCloudinaryByBuffer({file: req.file, folder: '/admin/product-categories'});
    }
    next();
  }),
  asyncHandler(controller.patchEdit)
);

router.patch('/change-multi', grantAccess('updateAny', 'Danh mục sản phẩm'), asyncHandler(controller.changeMulti));

router.get('/detail/:id', grantAccess('readAny', 'Danh mục sản phẩm'), asyncHandler(controller.detail));

module.exports = router;