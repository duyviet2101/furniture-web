const ProductCategory = require('../../models/product-category.model.js');

const createTree = require('../../helpers/createTree.js');
const searchHelper = require('../../helpers/search.js');
const paginationHelper = require('../../helpers/pagination.js');

// [GET] /admin/categories
exports.index = async (req, res) => {

  //! search
  const search = searchHelper(req);
  //! end search

  //! filter
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  //! end filter

  const find = {
    deleted: false,
    ...filter,
    ...search
  };

  //! pagination
  const paginationObject = paginationHelper({
    query: req.query,
    limitItems: 5,
    totalItems: await ProductCategory.countDocuments(find),
  });
  //! end pagination

  const categories = await ProductCategory
    .find(find)
    .sort({position: 1})
    .skip(paginationObject.startItem)
    .limit(paginationObject.limitItems);

  res.render('admin/pages/productCategories/index', {
    activeTab: 'categories',
    records: createTree(categories),
    filter,
    searchKey: req.query.search,
    paginationObject
  });
};