const Order = require('../../models/order.model');
const pagination = require('../../helpers/pagination.js');

const {priceNewProduct} = require('../../helpers/product.js');

// [GET] /admin/orders
module.exports.index = async (req, res, next) => {

  const find = {};

  //! Filter by status
  if (req.query.status) {
    find.status = req.query.status;
  }
  //! end Filter by status

  //! pagination
  const paginationObject = pagination({
    query: req.query,
    limitItems: 10,
    totalItems: await Order.countDocuments(find)
  })
  //! end pagination

  const orders = await Order.find(find)
    .sort({
      createdAt: -1
    })
    .skip(paginationObject.skipItems)
    .limit(paginationObject.limitItems)
    .lean();

  if (orders.length === 0 && paginationObject.currentPage > 1) {
    req.flash('error', 'Trang không tồn tại');
    return res.redirect('/admin/orders');
  }

  res.render('admin/pages/orders/index', {
    pageTitle: 'Orders',
    activeTab: 'orders',
    orders,
    filter: {
      status: req.query.status
    },
    paginationObject
  });
};

// [PATCH] /admin/orders/status/:id/:status
module.exports.status = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      message: 'Đơn hàng không tồn tại!'
    });
  }

  order.status = req.params.status;
  await order.save();

  res.status(200).json({
    message: 'Cập nhật trạng thái đơn hàng thành công!'
  });
};

// [PATCH] /admin/orders/change-multi
module.exports.changeMulti = async (req, res, next) => {
  const ids = req.body.ids.split(',');
  const status = req.body.status;

  await Order.updateMany({
    _id: {
      $in: ids
    }
  }, {
    status
  });

  req.flash('success', `Cập nhật trạng thái ${ids.length} đơn hàng thành công!`);
  res.redirect('/admin/orders');
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'products.product',
      select: 'title price thumbnail discountPercentage'
    })
    .lean();

  if (!order) {
    req.flash('error', 'Đơn hàng không tồn tại!');
    return res.redirect('/admin/orders');
  }

  order.products.forEach(item => {
    item.product = priceNewProduct(item.product);
  });

  // return res.json(order);

  res.render('admin/pages/orders/detail', {
    pageTitle: 'Chi tiết đơn hàng',
    activeTab: 'orders',
    order
  });
};