const Cart = require("../../models/cart.model.js");

module.exports.checkCart = async (req, res, next) => {
  const cartId = req.cookies.cartId;
  if (req.user && cartId) {
    const cart = await Cart.findOne({ _id: cartId });

    if (cart && cart.user && cart.user.toString() === req.user._id.toString()) {
      req.cart = cart;
      res.locals.cart = cart;
      return next();
    }

    if (cart && cart.user && cart.user.toString() != req.user._id.toString()) {
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        res.cookie("cartId", cart.id);
        req.cart = cart;
        res.locals.cart = cart;
        return next();
      }

      const newCart = await Cart.create({ products: [], user: req.user._id });
      res.cookie("cartId", newCart.id);
      req.cart = newCart;
      res.locals.cart = newCart;
      return next();
    }

    if (cart && !cart.user) {
      cart.user = req.user._id;
      await cart.save();
      req.cart = cart;
      res.locals.cart = cart;
      return next();
    }
  } else if (req.user && !cartId) {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      res.cookie("cartId", cart.id);
      req.cart = cart;
      res.locals.cart = cart;
      return next();
    }

    const newCart = await Cart.create({ products: [], user: req.user._id });
    res.cookie("cartId", newCart.id);
    req.cart = newCart;
    res.locals.cart = newCart;
    return next();
  } else if (!req.user && cartId) {
    const cart = await Cart.findOne({ _id: cartId });
    if (cart) {
      req.cart = cart;
      res.locals.cart = cart;
      return next();
    }

    const newCart = await Cart.create({ products: [] });
    res.cookie("cartId", newCart.id);
    req.cart = newCart;
    res.locals.cart = newCart;
    return next();
  } else {
    const cart = await Cart.create({ products: [] });
    res.cookie("cartId", cart.id);
    req.cart = cart;
    res.locals.cart = cart;
    return next();
  }
};