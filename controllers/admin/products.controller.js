const Product = require('../../models/product.model');
const Admin = require('../../models/admin.model');
const ProductCategory = require('../../models/product-category.model');
const mongoose = require('mongoose');

const createTree = require('../../helpers/createTree.js');
const pagination = require('../../helpers/pagination.js');

// [GET] /admin/products
module.exports.index = async (req, res, next) => {

  //! sort
  const sort = {};
  if (req.query.sortBy && req.query.sortValue) {
    sort[req.query.sortBy] = req.query.sortValue === 'asc' ? 1 : -1;
  }
  //! end sort

  //! find object
  const find = {
    deleted: false
  };
  //! end find object

  //pagination
  const paginationObject = pagination({
    query: req.query,
    limitItems: 5,
    totalItems: await Product.countDocuments(find),
  });
  //end pagination

  const products = await Product.find(find)
    .sort(sort)
    .skip(paginationObject.skipItems)
    .limit(paginationObject.limitItems)
    .lean();

  if (products.length === 0 && paginationObject.currentPage > 1) {
    req.flash('error', 'Trang không tồn tại!');
    return res.redirect('/admin/products');
  }

  for (let product of products) {
    const category = await ProductCategory.findById(product.product_category_id).lean();
    product.category = category;

    const createdBy = {};
    if (product.createdBy) {
      createdBy.accountInfo = await Admin.findById(product.createdBy.account_id)
                      .select('_id fullName email')
                      .lean();
      createdBy.createdAt = product.createdBy.createdAt;
    }
    product.createdBy = createdBy;
  }  

  res.render('admin/pages/products/index', {
    pageTitle: 'Products Management',
    activeTab: 'products',
    products,
    paginationObject,
    sort
  });
}

// [GET] /admin/products/create
module.exports.create = async (req, res, next) => {
  const categories = await ProductCategory.find({
    deleted: false
  });
  const categoriesTree = createTree(categories);
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
  const {
    title,
    price,
    stock,
    discountPercentage,
    categoryId,
    status,
    featured,
    position,
    description,
    thumbnail
  } = req.body;

  // Validate title
  if (!title) {
    req.flash('error', 'Tên sản phẩm không để trống!');
    return res.redirect('/admin/products/create');
  }

  // Validate price
  if (!price || parseInt(price.replace(/[^\d.]/g, '')) <= 0){
    req.flash('error', 'Giá không hợp lệ! (số dương)');
    return res.redirect('/admin/products/create');
  }

  // Validate stock
  if (!stock || isNaN(parseInt(stock)) || parseInt(stock) <= 0) {
    req.flash('error', 'Số lượng không hợp lệ! (số dương)');
    return res.redirect('/admin/products/create');
  }

  // Validate discountPercentage
  if (!discountPercentage || isNaN(parseInt(discountPercentage)) || parseInt(discountPercentage) < 0 || parseInt(discountPercentage) > 100) {
    req.flash('error', 'Phần trăm giảm giá không hợp lệ! (0 - 100)');
    return res.redirect('/admin/products/create');
  }

  // Validate categoryId
  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    req.flash('error', 'Danh mục không hợp lệ!');
    return res.redirect('/admin/products/create');
  }

  // Validate status
  if (!status) {
    req.flash('error', 'Trạng thái không hợp lệ!');
    return res.redirect('/admin/products/create');
  }

  // Validate position
  if (!position || isNaN(parseInt(position)) || parseInt(position) < 0){
    req.flash('error', 'Vị trí không hợp lệ!');
    return res.redirect('/admin/products/create');
  }

  // Validate description
  if (!description) {
    req.flash('error', 'Mô tả không để trống!');
    return res.redirect('/admin/products/create');
  }

  // Validate thumbnail
  if (!thumbnail) {
    req.flash('error', 'Ảnh không để trống!');
    return res.redirect('/admin/products/create');
  }
  
  const newProduct = await Product.create({
    title,
    price: parseInt(price.replace(/[^\d.]/g, '')),
    stock: parseInt(stock),
    discountPercentage: parseInt(discountPercentage),
    product_category_id: categoryId,
    status,
    featured : featured === "true" ? true : false,
    position: parseInt(position),
    description,
    thumbnail,
    createdBy: {
      account_id: req.admin._id,
      createdAt: new Date()
    }
  }).catch(error => {
    console.log(error);
    req.flash('error', `Thât bại! <br> ${error}`);
    return res.redirect('/admin/products/create');
  });
  
  req.flash('success', `Tạo <strong> ${newProduct.title} </strong> thành công`);
  return res.redirect('/admin/products/create');
}