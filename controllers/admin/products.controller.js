const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');

const createTree = require('../../helpers/createTree.js')

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

// [GET] /admin/products/create
module.exports.create = async (req, res, next) => {
  const categories = await ProductCategory.find({
    deleted: false
  });
  const categoriesTree = createTree(categories);
  console.log(categoriesTree);
  const countProducts = await Product.countDocuments({
    deleted: false
  });

  res.render('admin/pages/products/create', {
    pageTitle: 'Create Product',
    activeTab: 'products',
    categories,
    countProducts,
    categoriesTree
  });
}

// [POST] /admin/products/create
module.exports.postCreate = async (req, res, next) => {
  req.flash('error', 'Chức năng này chưa được cài đặt');
  res.redirect('back');
}