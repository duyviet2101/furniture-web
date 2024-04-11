const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model.js')

const createTree = require('../../helpers/createTree.js');
const searchHelper = require('../../helpers/search.js');
const pagination = require('../../helpers/pagination.js');

// [GET] /products
module.exports.index = async (req, res, next) => {

  const find = {
    deleted: false,
    status: 'active',
  };

  //!pagination
  const paginationObject = pagination({
    query: req.query,
    limitItems: 9,
    totalItems: await Product.countDocuments(find),
  });
  //!end pagination

  const products = await Product.find(find)
    .skip(paginationObject.skipItems)
    .limit(paginationObject.limitItems)
    .lean();
  const productCategories = await ProductCategory.find({
    deleted: false,
    status: 'active',
  });
  res.render('client/pages/products/index', {
    pageTitle: 'Sản phẩm',
    activeTab: 'products',
    products,
    paginationObject,
    productCategories,
  });
}