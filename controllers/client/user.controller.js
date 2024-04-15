const User = require('../../models/user.model');
const Order = require('../../models/order.model');

// [GET] /user
module.exports.index = async (req, res, next) => {
  let orders = [];

  if (req.user) {
    orders = await Order.find({ "userInfo.user_id": req.user._id }).sort({ createdAt: -1 });
  } else if (req.cart) {
    orders = await Order.find({ "cart": req.cart._id }).sort({ createdAt: -1 });
  }

  res.render('client/pages/user/index', {
    title: 'User',
    orders
  });
};