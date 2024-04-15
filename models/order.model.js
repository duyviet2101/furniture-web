const mongoose = require('mongoose')
const crypto = require('crypto-js')

const orderSchema = new mongoose.Schema({
  code: {
    type: String,
    default: crypto.lib.WordArray.random(5).toString()
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  },
  userInfo: {
    fullName: String,
    phone: String,
    email: String,
    address: {
      province: String,
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
    enum: ["pending", "processing", "completed", "cancelled" ,"shipping"],
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