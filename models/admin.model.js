const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: crypto.randomUUID()
    },
    phone: String,
    avatar: String,
    status: String,
    role_id: String,
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