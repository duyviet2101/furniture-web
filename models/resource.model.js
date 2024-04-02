const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
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

module.exports = mongoose.model("Source", resourceSchema, "resources");