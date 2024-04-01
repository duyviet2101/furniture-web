const ProductCategory = require('../../models/product-category.model.js');

const createTree = require('../../helpers/createTree.js');

// [GET] /admin/categories
exports.index = async (req, res) => {

  //! filter
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  //! end filter

  const find = {
    deleted: false,
    ...filter,
  };

  const categories = await ProductCategory
    .find(find);

  res.render('admin/pages/productCategories/index', {
    activeTab: 'categories',
    records: createTree(categories),
    filter,
  });
};