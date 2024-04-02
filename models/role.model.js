const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: String,
    description: String,
    grants: [
      {
        resource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
        },
        actions: [{
          type: String,
          required: true,
        }],
        attributes: [{
          type: String,
          default: "*",
        }],
      },
    ],
    createdBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      createdAt: Date,
    },
    updatedBy: [
      {
        account_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
        updatedAt: Date,
      }
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      deletedAt: Date,
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model("Role", roleSchema, "roles");