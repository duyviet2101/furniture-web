const Product = require('../../models/product.model');
const Category = require('../../models/product-category.model');
const User = require('../../models/user.model');
const Order = require('../../models/order.model');

// [GET] /admin
module.exports.index = async (req, res, next) => {
  const productCount = await Product.countDocuments({});
  const activeProductCount = await Product.countDocuments({ status: 'active' });
  const inactiveProductCount = await Product.countDocuments({ status: 'inactive' });

  const categoryCount = await Category.countDocuments({});
  const activeCategoryCount = await Category.countDocuments({ status: 'active' });
  const inactiveCategoryCount = await Category.countDocuments({ status: 'inactive' });

  const userCount = await User.countDocuments({});
  const activeUserCount = await User.countDocuments({ status: 'active' });
  const inactiveUserCount = await User.countDocuments({ status: 'inactive' });

  const orderCount = await Order.countDocuments({});
  const pendingOrderCount = await Order
    .countDocuments({ status: 'pending' });
  const completedOrderCount = await Order
    .countDocuments({ status: 'completed' });

  res.render('admin/pages/dashboard/index', {
    pageTitle: 'Dashboard',
    activeTab: 'dashboard',
    productCount,
    activeProductCount,
    inactiveProductCount,
    categoryCount,
    activeCategoryCount,
    inactiveCategoryCount,
    userCount,
    activeUserCount,
    inactiveUserCount,
    orderCount,
    pendingOrderCount,
    completedOrderCount
  });
}