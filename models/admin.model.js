const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    refreshToken: String,
    phone: String,
    avatar: String,
    status: String,
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Account = mongoose.model("Admin", adminSchema, "admins");

module.exports = Account;