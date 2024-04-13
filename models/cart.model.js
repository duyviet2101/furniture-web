const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive", "completed", "pending"],
      default: "active",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;