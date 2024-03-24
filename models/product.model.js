const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: [String],
  status: String,
  featured: Boolean, // san pham noi bat
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
}, {
  // timestamps: true
});

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product