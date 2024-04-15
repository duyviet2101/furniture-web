const Order = require('../../models/order.model');
const pagination = require('../../helpers/pagination.js');

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
    }
  });
};