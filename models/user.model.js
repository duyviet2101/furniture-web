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
    avatar: String,
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