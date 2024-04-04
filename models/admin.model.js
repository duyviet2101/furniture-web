const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
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
    createdBy: {
      account_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin'
      },
      createdAt: {
        type: Date
      },
    },
    deletedBy: {
      account_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin'
      },
      deletedAt: Date
    },
    updatedBy: [
      {
        account_id: {
          type: mongoose.Types.ObjectId,
          ref: 'Admin'
        },
        updatedAt: Date
      }
    ]
  },
  { timestamps: true }
);

const Account = mongoose.model("Admin", adminSchema, "admins");

module.exports = Account;