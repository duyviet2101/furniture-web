const Cart = require("../../models/cart.model.js");
const Product = require("../../models/product.model.js");

const {priceNewProduct} = require("../../helpers/product.js");

// [POST] /cart/add
module.exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Invalid data" });
  }

  if (isNaN(quantity) || parseInt(quantity) <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const product = await Product.findOne({
    _id: productId,
  });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < parseInt(quantity)) {
    return res.status(400).json({ message: "Product out of stock" });
  }

  const index = cart.products.findIndex((product) => product.product.toString() === productId);
  if (index === -1) {
    cart.products.push({ product: productId, quantity: parseInt(quantity) });
    cart.count += parseInt(quantity);
  } else {
    cart.products[index].quantity += parseInt(quantity);
    cart.count += parseInt(quantity);
  }

  await cart.save();
  res.status(200).json(cart);
};

// [GET] /cart
module.exports.index = async (req, res, next) => {
  const cart = await Cart.findOne({
    _id: req.cart._id,
  }).populate({
    path: "products.product",
    populate: {
      path: "product_category_id",
      select: "title _id"
    },
    select: "title price image product_category_id discountPercentage thumbnail",
  }).lean();

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

  // return res.json(cart);

  res.render("client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    cart,
  })
};

// [DELETE] /cart/remove/:productId
module.exports.removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const { cart } = req;

  const index = cart.products.findIndex((product) => product.product.toString() === productId);
  if (index !== -1) {
    cart.count -= cart.products[index].quantity;
    cart.products.splice(index, 1);
  }

  await cart.save();
  res.status(200).json(cart);
};

// [PATCH] /cart/update
module.exports.updateCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Invalid data" });
  }

  if (isNaN(quantity) || parseInt(quantity) <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const product = await Product.findOne({
    _id: productId,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < parseInt(quantity)) {
    return res.status(400).json({ message: "Product out of stock" });
  }

  const index = cart.products.findIndex((product) => product.product.toString() === productId);
  if (index !== -1) {
    cart.count -= cart.products[index].quantity;
    cart.products[index].quantity = parseInt(quantity);
    cart.count += parseInt(quantity);
  }

  await cart.save();

  const newCart = await Cart.findOne({
    _id: cart._id,
  }).populate({
    path: "products.product",
    select: "title price image product_category_id discountPercentage thumbnail",
  }).lean();

  newCart.products.forEach((item) => {
    item.product = priceNewProduct(item.product);
  });

  let total = 0;
  let discount = 0;
  newCart.products.forEach((item) => {
    total += item.product.newPrice * item.quantity;
    discount += (item.product.discountPercentage * item.product.price * item.quantity / 100);
  });
  newCart.total = total.toFixed(0);
  newCart.discount = discount.toFixed(0);

  res.status(200).json(newCart);
};