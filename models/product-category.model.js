const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: String,
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: 'title',
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    account_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Admin'
    },
    createdAt: {
      type: Date,
      default: Date.now()
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
      updatedAt: {
        type: Date,
        default: Date.now()
      }
    }
  ]
}, {
  // timestamps: true
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, 'products-category')

module.exports = ProductCategory