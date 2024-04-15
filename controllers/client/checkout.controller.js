const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const { priceNewProduct } = require('../../helpers/product');

// [GET] /checkout
module.exports.index = async (req, res, next) => {
  const cart = await Cart.findOne({
    _id: req.cart._id,
  }).populate({
    path: "products.product",
    select: "title price image product_category_id discountPercentage thumbnail",
  }).lean();

  if (!cart.products.length) {
    req.flash('error', 'Giỏ hàng của bạn đang trống, vui lòng thêm sản phẩm vào giỏ hàng để tiếp tục');
    return res.redirect('/cart');
  }

  cart.products.forEach((item) => {
    item.product = priceNewProduct(item.product);
  });

  let total = 0;
  let discount = 0;
  cart.products.forEach((item) => {
    total += item.product.newPrice * item.quantity;
    discount += (item.product.discountPercentage * item.product.price * item.quantity / 100);
  });
  cart.total = total.toFixed(0);
  cart.discount = discount.toFixed(0);

  res.render('client/pages/checkout/index', {
    pageTitle: 'Thanh toán',
    cart,
  })
}

// [POST] /checkout
module.exports.order = async (req, res, next) => {
  let { cart } = req;
  
  if (!cart.products.length) {
    req.flash('error', 'Giỏ hàng của bạn đang trống, vui lòng thêm sản phẩm vào giỏ hàng để tiếp tục');
    return res.redirect('/cart');
  }

  cart = await cart.populate({
    path: "products.product",
    select: "title price image product_category_id discountPercentage thumbnail",
  });


  cart = cart.toObject();
  cart.products.forEach((item) => {
    item.product = priceNewProduct(item.product);
  });
  let total = 0;
  let discount = 0;
  cart.products.forEach((item) => {
    total += item.product.newPrice * item.quantity;
    discount += (item.product.discountPercentage * item.product.price * item.quantity / 100);
  });
  cart.total = Number(total.toFixed(0));
  cart.discount = Number(discount.toFixed(0));

  const { 
    fullName, 
    phone,
    email, 
    province,
    district,
    ward,
    detailAddress, 
    notes,
    discountCode
  } = req.body;

  const order = new Order({
    cart: cart._id,
    userInfo: {
      fullName,
      phone,
      email,
      address: {
        province,
        district,
        ward,
        detailAddress
      },
      user_id: req.user ? req.user._id : null
    },
    products: cart.products.map((product) => ({
      product: product.product,
      quantity: product.quantity,
      discountCode: discountCode ? discountCode : null,
      price: product.product.newPrice
    })),
    discount: cart.discount,
    total: cart.total,
    notes,
  });

  await order.save();

  cart.products.forEach(async (item) => {
    const product = await Product.findOne({
      _id: item.product._id,
    });
    product.stock -= item.quantity;
    await product.save();
  });

  cart = await Cart.findOne({
    _id: cart._id,
  });
  cart.products = [];
  cart.count = 0;
  await cart.save();

  res.render('client/pages/checkout/success', {
    pageTitle: 'Đặt hàng thành công',
  });
}