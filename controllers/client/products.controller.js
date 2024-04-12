const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model.js')

const createTree = require('../../helpers/createTree.js');
const searchHelper = require('../../helpers/search.js');
const pagination = require('../../helpers/pagination.js');

// [GET] /products
module.exports.index = async (req, res, next) => {

  //! search
  const search = searchHelper(req);
  //! end search

  const find = {
    deleted: false,
    status: 'active',
    ...search,
  };

  //! sort
  const sort = {};
  if (req.query.sortBy && req.query.sortValue) {
    sort[req.query.sortBy] = req.query.sortValue === 'asc' ? 1 : -1;
  } else {
    sort.position = -1;
  }
  //! end sort

  // !price filter
  if (req.query.priceFrom && req.query.priceTo) {
    find.price = {
      $gte: req.query.priceFrom,
      $lte: req.query.priceTo === "inf" ? 999999999999 : req.query.priceTo,
    };
  }
  // !end price filter

  //!pagination
  const paginationObject = pagination({
    query: req.query,
    limitItems: 9,
    totalItems: await Product.countDocuments(find),
  });
  //!end pagination

  const products = await Product.find(find)
    .sort(sort)
    .skip(paginationObject.skipItems)
    .limit(paginationObject.limitItems)
    .lean();
  const productCategories = await ProductCategory.find({
    deleted: false,
    status: 'active',
  });

  if (products.length === 0 && paginationObject.currentPage !== 1) {
    req.flash('error', 'Trang bạn tìm không tồn tại');
    return res.redirect('/products');
  }

  res.render('client/pages/products/index', {
    pageTitle: 'Sản phẩm',
    activeTab: 'products',
    products,
    paginationObject,
    productCategories,
    searchKey: req.query.search,
  });
}

// [GET] /products/:slugCategory
module.exports.byCategory = async (req, res, next) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: 'active',
  });

  if (!category) {
    throw new Error('Danh mục không tồn tại!');
  }

  //! search
  const search = searchHelper(req);
  //! end search

  //! all sub category
  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      deleted: false,
      status: 'active',
    });

    let allSub = [...subs];

    for (const sub of subs) {
      allSub = [...allSub, ...await getSubCategory(sub._id)];
    }

    return allSub;
  }
  const listSubCategory = (await getSubCategory(category._id)).map((sub) => sub._id);
  //! end all sub category

  //! parent category
  const getParentCategory = async (parentCategory) => {
    if (!parentCategory.parent_id) {
      return parentCategory.slug;
    }

    const parent = await ProductCategory.findById(parentCategory.parent_id);

    return getParentCategory(parent);
  }
  const parentCategorySlug = await getParentCategory(category);
  //! end parent category

  const find = {
    deleted: false,
    status: 'active',
    product_category_id: {
      $in: [category._id, ...listSubCategory],
    },
    ...search,
  };

  //! sort
  const sort = {};
  if (req.query.sortBy && req.query.sortValue) {
    sort[req.query.sortBy] = req.query.sortValue === 'asc' ? 1 : -1;
  } else {
    sort.position = -1;
  }
  //! end sort

  // !price filter
  if (req.query.priceFrom && req.query.priceTo) {
    find.price = {
      $gte: req.query.priceFrom,
      $lte: req.query.priceTo === "inf" ? 999999999999 : req.query.priceTo,
    };
  }
  // !end price filter

  //!pagination
  const paginationObject = pagination({
    query: req.query,
    limitItems: 9,
    totalItems: await Product.countDocuments(find),
  });
  //!end pagination

  const products = await Product.find(find)
    .sort(sort)
    .skip(paginationObject.skipItems)
    .limit(paginationObject.limitItems)
    .lean();
  const productCategories = await ProductCategory.find({
    deleted: false,
    status: 'active',
  });

  if (products.length === 0 && paginationObject.currentPage !== 1) {
    req.flash('error', 'Trang bạn tìm không tồn tại');
    return res.redirect(`/products/${category.slug}`);
  }

  res.render('./client/pages/products/index.pug', {
    pageTitle: category.name,
    activeTab: 'products',
    products,
    paginationObject,
    productCategories,
    searchKey: req.query.search,
    categorySlug: parentCategorySlug,
  });
}