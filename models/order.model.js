const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  },
  userInfo: {
    fullName: String,
    phone: String,
    email: String,
    address: {
      procvince: String,
      district: String,
      ward: String,
      detailAddress: String
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: Number,
      discountCode: {
        type: String,
        ref: "DiscountCode"
      },
      price: Number
    }
  ],
  discount: Number,
  total: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "bank"],
    default: "cod"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
  shippingStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
  shippingFee: Number,
  notes: String,
}, {
  timestamps: true
})

const order = mongoose.model("order", orderSchema, "orders")

module.exports = order