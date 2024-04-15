const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    refreshToken: {
      type: String,
      default: null,
    },
    phone: String,
    avatar: {
      type: String,
      default: "https://avatar.iran.liara.run/public",
    },
    address: {
      province: String,
      district: String,
      ward: String,
      detailAddress: String
    },
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date
  },
  { timestamps: true }
);

const Account = mongoose.model("User", userSchema, "users");

module.exports = Account;