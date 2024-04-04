const express = require('express');
const router = express.Router();

const upload = require('multer')();
const {uploadMultipleCloudinaryByBuffer} = require('../../helpers/uploadCloudinary.js');

const asyncHandler = require('../../helpers/handleError.js');
const controller = require('../../controllers/admin/products.controller.js');

//! kiểm soát phân quyền
const { grantAccess } = require('../../middlewares/admin/rbac.middleware.js');
//! end kiểm soát phân quyền

router.get('/', grantAccess('readAny', 'Sản phẩm'), asyncHandler(controller.index));

router.get('/create', grantAccess('createAny', 'Sản phẩm'),asyncHandler(controller.create));

router.post('/create',
  grantAccess('createAny', 'Sản phẩm'),
  upload.array('thumbnail', 10),
  asyncHandler(async (req, res, next) => {
    if (req.files) {
      req.body.thumbnail = await uploadMultipleCloudinaryByBuffer({files: req.files, folder: '/admin/products'});
    }
    next();
  }),
  asyncHandler(controller.postCreate)
);

router.patch('/status/:id/:status', grantAccess('updateAny', 'Sản phẩm'), asyncHandler(controller.status));

router.get('/edit/:id', grantAccess('updateAny', 'Sản phẩm'), asyncHandler(controller.edit));

router.patch('/edit/:id',
  grantAccess('updateAny', 'Sản phẩm'),
  upload.array('thumbnail', 10),
  asyncHandler(async (req, res, next) => {
    if (req.files) {
      req.body.thumbnail = await uploadMultipleCloudinaryByBuffer({files: req.files, folder: '/admin/products'});
    }
    next();
  }),
  asyncHandler(controller.patchEdit)
);

router.delete('/delete/:id', grantAccess('deleteAny', 'Sản phẩm'), asyncHandler(controller.delete));

router.patch('/change-position/:id', grantAccess('updateAny', 'Sản phẩm'), asyncHandler(controller.changePosition));

router.patch('/change-multi', grantAccess('updateAny', 'Sản phẩm'), asyncHandler(controller.changeMulti));

router.get('/detail/:id', grantAccess('readAny', 'Sản phẩm'), asyncHandler(controller.detail));

module.exports = router;