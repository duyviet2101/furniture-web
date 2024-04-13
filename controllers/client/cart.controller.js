const Cart = require("../../models/cart.model.js");

// [POST] /cart/add
module.exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

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