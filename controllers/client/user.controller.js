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

// [GET] /user/edit
module.exports.edit = async (req, res, next) => {
  res.render('client/pages/user/edit', {
    title: 'Edit User'
  });
};

// [PATCH] /user/edit
module.exports.patchEdit = async (req, res, next) => {
  const { 
    fullName, 
    phone, 
    email,
    province,
    district,
    ward,
    detailAddress
  } = req.body;
  const user = await User.findById(req.user._id);

  if (fullName) {
    user.fullName = fullName;
  }

  if (phone) {
    user.phone = phone;
  }

  if (email) {
    user.email = email;
  }

  if (province) {
    user.address.province = province;
  }

  if (district) {
    user.address.district = district;
  }

  if (ward) {
    user.address.ward = ward;
  }

  if (detailAddress) {
    user.address.detailAddress = detailAddress;
  }

  await user.save();

  req.flash('success', 'Cập nhật thành công!');
  res.redirect('/user');
}