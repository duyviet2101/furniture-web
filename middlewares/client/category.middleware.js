const ProductCategory = require('../../models/product-category.model.js');
const createTree = require('../../helpers/createTree.js');

module.exports = async (req, res, next) => {
  const productCategories = await ProductCategory.find({
    deleted: false,
    status: 'active',
  });

  res.locals.productCategoriesTree = createTree(productCategories);

  next();
}