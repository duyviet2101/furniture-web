const Product = require('../../models/product.model')

// [GET] /products
module.exports.index = async (req, res, next) => {
  const products = await Product.find({
    deleted: false,
    status: 'active',
  });
  res.render('client/pages/products/index', {
    pageTitle: 'Sản phẩm',
    activeTab: 'products',
    products,
  });
}