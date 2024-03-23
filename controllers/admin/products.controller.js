const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');

// [GET] /admin/products
module.exports.index = async (req, res, next) => {
  const products = await Product.find({
    deleted: false
  }).lean();

  for (let product of products) {
    const category = await ProductCategory.findById(product.product_category_id).lean();
    product.category = category;
  }  

  res.render('admin/pages/products/index', {
    pageTitle: 'Products Management',
    activeTab: 'products',
    products
  });
}