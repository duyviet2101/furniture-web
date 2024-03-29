const Product = require('../../models/product.model');
const Admin = require('../../models/admin.model');
const ProductCategory = require('../../models/product-category.model');
const mongoose = require('mongoose');

const createTree = require('../../helpers/createTree.js');
const pagination = require('../../helpers/pagination.js');
const convertToSlug = require('../../helpers/convertToSlug.js');

// [GET] /admin/products
module.exports.index = async (req, res, next) => {

  //!search
  const search = {};
  if (req.query.search) {
    search['$or'] = [];
    search['$or'].push({
      title: {
        '$regex': req.query.search,
        '$options': 'i'
      }
    });
    search['$or'].push({
      description: {
        '$regex': req.query.search,
        '$options': 'i'
      }
    });
    search['$or'].push({
      slug: {
        '$regex': convertToSlug(req.query.search),
        '$options': 'i'
      }
    });
  }
  //!end search

  //! sort
  const sort = {};
  if (req.query.sortBy && req.query.sortValue) {
    sort[req.query.sortBy] = req.query.sortValue === 'asc' ? 1 : -1;
  }
  //! end sort

  //! filter
  const filter = {};

  const getSubCategories = async (categoryId) => {
    const subs = await ProductCategory.find({
      parent_id: categoryId,
      deleted: false
    });
    
    let allSubs = [...subs];

    for (let sub of subs) {
      const childs = await getSubCategories(sub._id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  }

  const listSubsCategories = await getSubCategories(new mongoose.Types.ObjectId(req.query.categoryId));
  const listSubsCategoriesId = listSubsCategories.map(sub => sub._id);

  if (req.query.categoryId) {
    filter.product_category_id = {$in: [new mongoose.Types.ObjectId(req.query.categoryId), ...listSubsCategoriesId]};
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  // return res.json(filter);  
  //! end filter

  //! find object
  const find = {
    deleted: false,
    ...search,
    ...filter
  };
  //! end find object

  //!pagination
  const paginationObject = pagination({
    query: req.query,
    limitItems: 5,
    totalItems: await Product.countDocuments(find),
  });
  //!end pagination

  const products = await Product.find(find)
    .sort(sort)
    .skip(paginationObject.skipItems)
    .limit(paginationObject.limitItems)
    .lean();

  if (products.length === 0 && paginationObject.currentPage > 1) {
    req.flash('error', 'Không tìm thấy sản phẩm nào!');
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

    const updatedBy = {};
    if (product.updatedBy && product.updatedBy.length > 0) {
      updatedBy.accountInfo = await Admin.findById(product.updatedBy[product.updatedBy.length - 1].account_id)
                      .select('_id fullName email')
                      .lean();
      updatedBy.updatedAt = product.updatedBy[product.updatedBy.length - 1].updatedAt;
    }
    product.updatedBy = updatedBy;
  }  

  const categories = await ProductCategory.find({
    deleted: false
  });
  const categoriesTree = createTree(categories);

  res.render('admin/pages/products/index', {
    pageTitle: 'Products Management',
    activeTab: 'products',
    products,
    paginationObject,
    sort,
    categoriesTree,
    searchKey: req.query.search,
    filter: {
      categoryId: req.query.categoryId,
      status: req.query.status
    }
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

// [PATCH] /admin/products/status/:id/:status
module.exports.status = async (req, res, next) => {
  const {id, status} = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({message: 'Id không hợp lệ!'});
  }

  if (status !== 'active' && status !== 'inactive') {
    res.status(400).json({message: 'Trạng thái không hợp lệ!'});
  }

  const product = await Product.findById(id);
  if (!product) {
    res.status(404).json({message: 'Không tìm thấy sản phẩm!'});
  }

  product.status = status === 'active' ? 'active' : 'inactive';
  product.updatedBy.push({
    account_id: req.admin._id,
    updatedAt: new Date()
  });
  await product.save();

  const updatedBy = {
    accountInfo: await Admin.findById(req.admin._id)
                  .select('_id fullName email')
                  .lean(),
    updatedAt: new Date()
  };

  res.status(200).json({
    message: 'Cập nhật trạng thái thành công!',
    updatedBy
  });
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash('error', 'Id không hợp lệ!');
    return res.redirect('/admin/products');
  }

  const product = await Product.findById(id);
  if (!product) {
    req.flash('error', 'Không tìm thấy sản phẩm!');
    return res.redirect('/admin/products');
  }

  const categories = await ProductCategory.find({
    deleted: false
  });
  const categoriesTree = createTree(categories);

  res.render('admin/pages/products/edit', {
    pageTitle: 'Edit Product',
    activeTab: 'products',
    product,
    categories,
    categoriesTree
  });
}

// [PATCH] /admin/products/edit/:id
module.exports.patchEdit = async (req, res, next) => {
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
    thumbnail,
    currentThumbnail
  } = req.body;

  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash('error', 'Id không hợp lệ!');
    return res.redirect('/admin/products');
  }

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

  const product = await Product.findById(id);
  if (!product) {
    req.flash('error', 'Không tìm thấy sản phẩm!');
    return res.redirect('/admin/products');
  }

  product.title = title;
  product.price = parseInt(price.replace(/[^\d.]/g, ''));
  product.stock = parseInt(stock);
  product.discountPercentage = parseInt(discountPercentage);
  product.product_category_id = categoryId;
  product.status = status;
  product.featured = featured === "true" ? true : false;
  product.position = parseInt(position);
  product.description = description;
  product.thumbnail = [...currentThumbnail, ...thumbnail];
  product.updatedBy.push({
    account_id: req.admin._id,
    updatedAt: new Date()
  });

  await product.save();

  req.flash('success', `Cập nhật <strong> ${product.title} </strong> thành công`);
  return res.redirect(`/admin/products/edit/${id}`);
}

// [DELETE] /admin/products/delete/:id
module.exports.delete = async (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash('error', 'Id không hợp lệ!');
    return res.redirect('/admin/products');
  }

  const product = await Product.findById(id);
  if (!product) {
    req.flash('error', 'Không tìm thấy sản phẩm!');
    return res.redirect('/admin/products');
  }

  product.deleted = true;
  product.deletedBy = {
    account_id: req.admin._id,
    deletedAt: new Date()
  };

  await product.save();

  req.flash('success', `Xóa <strong> ${product.title} </strong> thành công`);
  return res.redirect('/admin/products');
}