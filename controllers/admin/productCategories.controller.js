const ProductCategory = require('../../models/product-category.model.js');
const Product = require('../../models/product.model.js');

const createTree = require('../../helpers/createTree.js');
const searchHelper = require('../../helpers/search.js');
const paginationHelper = require('../../helpers/pagination.js');
const mongoose = require('mongoose');
const Account = require('../../models/admin.model.js');

// [GET] /admin/product-categories
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
  // const paginationObject = paginationHelper({
  //   query: req.query,
  //   limitItems: 5,
  //   totalItems: await ProductCategory.countDocuments(find),
  // });
  //! end pagination

  const categories = await ProductCategory
    .find(find)
    .sort({
      position: -1
    })
    .lean();
    // .skip(paginationObject.startItem)
    // .limit(paginationObject.limitItems);

  for (let category of categories) {
    const createdBy = {};
    if (category.createdBy.account_id) {
      createdBy.accountInfo = await Account.findById(category.createdBy.account_id)
        .select('_id fullName email')
        .lean();
      createdBy.createdAt = category.createdBy.createdAt;
    };
    category['createdBy'] = createdBy;

    const updatedBy = {};
    if (category.updatedBy.length > 0) {
      updatedBy.accountInfo = await Account.findById(category.updatedBy[category.updatedBy.length - 1].account_id)
        .select('_id fullName email')
        .lean();
      updatedBy.updatedAt = category.updatedBy[category.updatedBy.length - 1].updatedAt;
    };
    category['updatedBy'] = updatedBy;
  }

  res.render('admin/pages/productCategories/index', {
    activeTab: 'product-categories',
    records: createTree(categories),
    filter,
    searchKey: req.query.search,
    // paginationObject
  });
};

// [GET] /admin/product-categories/create
module.exports.create = async (req, res) => {
  const categories = await ProductCategory.find({
    deleted: false
  });

  const categoriesTree = createTree(categories);
  const countCategories = await ProductCategory.countDocuments({
    deleted: false
  });

  res.render('admin/pages/productCategories/create', {
    pageTile: "Create Product Category",
    activeTab: 'product-categories',
    categoriesTree,
    countCategories
  });
};

// [POST] /admin/product-categories/create
module.exports.postCreate = async (req, res) => {
  const {
    title,
    parentId,
    thumbnail,
    status,
    position,
    description
  } = req.body;

  if (!title) {
    req.flash('error', 'Title không được để trống!');
    return res.redirect('/admin/product-categories/create');
  }

  if (!thumbnail) {
    req.flash('error', 'Thumbnail không được để trống!');
    return res.redirect('/admin/product-categories/create');
  }

  if (!status) {
    req.flash('error', 'Status không được để trống!');
    return res.redirect('/admin/product-categories/create');
  }

  if (!position) {
    req.flash('error', 'Position không được để trống!');
    return res.redirect('/admin/product-categories/create');
  }

  const newCategory = ProductCategory.create({
    title,
    parent_id: parentId,
    description,
    thumbnail,
    status,
    position: parseInt(position),
    createdBy: {
      account_id: req.admin._id,
      createdAt: Date.now()
    }
  });

  req.flash('success', `Tạo mới <strong> ${title} </strong> thành công!`);
  res.redirect('/admin/product-categories');
};

// [DELETE] /admin/product-categories/delete/:id
module.exports.delete = async (req, res) => {
  const {
    id
  } = req.params;
  const category = await ProductCategory
    .findById(id);

  if (!category) {
    req.flash('error', 'Danh mục không tồn tại!');
    return res.redirect('/admin/product-categories');
  }

  const products = await Product.find({
    product_category_id: id,
    deleted: false
  });

  if (products.length > 0) {
    req.flash('error', `Danh mục <strong> ${category.title} </strong> không thể xóa vì có sản phẩm!`);
    return res.redirect('/admin/product-categories');
  }

  await ProductCategory.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedAt: Date.now(),
    deletedBy: {
      account_id: req.admin._id,
      deletedAt: Date.now()
    }
  });

  req.flash('success', `Xóa thành công!`);

  res.redirect('/admin/product-categories');
}

// [PATCH] /admin/product-categories/status/:id/:status
module.exports.status = async (req, res, next) => {
  const {
    id,
    status
  } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      message: 'Id không hợp lệ!'
    });
  }

  if (status !== 'active' && status !== 'inactive') {
    res.status(400).json({
      message: 'Trạng thái không hợp lệ!'
    });
  }

  const category = await ProductCategory.findById(id);
  if (!category) {
    res.status(404).json({
      message: 'Danh mục không tồn tại!'
    });
  }

  category.status = status;
  category.updatedBy.push({
    account_id: req.admin._id,
    updatedAt: new Date()
  });
  await category.save();

  const updatedBy = {
    accountInfo: await Account.findById(req.admin._id)
                        .select('_id fullName email')
                        .lean(),
    updatedAt: new Date(),
  };

  res.status(200).json({
    message: 'Cập nhật trạng thái thành công!',
    updatedBy
  });
}

// [PATCH] /admin/product-categories/change-position/:id
module.exports.changePosition = async (req, res, next) => {
  const {id} = req.params;
  const {position} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      message: 'Id không hợp lệ!'
    });
  }

  if  (!position || isNaN(parseInt(position)) || parseInt(position) < 0) {
    res.status(400).json({
      message: 'Vị trí không hợp lệ!'
    });
  }

  const category = await ProductCategory.findById(id);
  if (!category) {
    res.status(404).json({
      message: 'Danh mục không tồn tại!'
    });
  }

  category.position = parseInt(position);
  category.updatedBy.push({
    account_id: req.admin._id,
    updatedAt: new Date()
  });

  await category.save();

  const updatedBy = {
    accountInfo: await Account.findById(req.admin._id)
                        .select('_id fullName email')
                        .lean(),
    updatedAt: new Date(),
  };

  res.status(200).json({
    message: 'Cập nhật vị trí thành công!',
    updatedBy
  });
}

// [GET] /admin/product-categories/edit/:id
module.exports.edit = async (req, res) => {
  const {
    id
  } = req.params;

  const category = await ProductCategory.findById(id);
  if (!category) {
    req.flash('error', 'Danh mục không tồn tại!');
    return res.redirect('/admin/product-categories');
  }

  const categories = await ProductCategory.find({
    deleted: false
  });

  const categoriesTree = createTree(categories);
  const countCategories = await ProductCategory.countDocuments({
    deleted: false
  });

  res.render('admin/pages/productCategories/edit', {
    pageTile: "Edit Product Category",
    activeTab: 'product-categories',
    category,
    categoriesTree,
    countCategories
  });
}

// [PATCH] /admin/product-categories/edit/:id
module.exports.patchEdit = async (req, res, next) => {
  const {
    id
  } = req.params;

  const {
    title,
    parentId,
    thumbnail,
    status,
    position,
    description
  } = req.body;

  if (!title) {
    req.flash('error', 'Title không được để trống!');
    return res.redirect(`/admin/product-categories/edit/${id}`);
  }

  if (!status) {
    req.flash('error', 'Status không được để trống!');
    return res.redirect(`/admin/product-categories/edit/${id}`);
  }

  if (!position) {
    req.flash('error', 'Position không được để trống!');
    return res.redirect(`/admin/product-categories/edit/${id}`);
  }

  const category = await ProductCategory.findById(id);
  if (!category) {
    req.flash('error', 'Danh mục không tồn tại!');
    return res.redirect('/admin/product-categories');
  }

  category.title = title;
  //! validate parentId
  if (parentId) {
    if (parentId === id) {
      req.flash('error', 'Danh mục cha không được là chính nó!');
      return res.redirect(`/admin/product-categories/edit/${id}`);
    }
    const parentCategory = await ProductCategory.findById(parentId);
    if (!parentCategory) {
      req.flash('error', 'Danh mục cha không tồn tại!');
      return res.redirect(`/admin/product-categories/edit/${id}`);
    }

    const checkParent = async (parentId) => {
      const parent = await ProductCategory.findById(parentId);
      if (parent.parent_id) {
        if (parent.parent_id === id) {
          return false;
        }
        return checkParent(parent.parent_id);
      } else {
        return true;
      }
    }

    if (await checkParent(parentId)) 
      category.parent_id = parentId;
    else {
      req.flash('error', 'Danh mục cha không hợp lệ!');
      return res.redirect(`/admin/product-categories/edit/${id}`);
    }
  }
  //! end validate parentId
  if (thumbnail) {
    category.thumbnail = thumbnail;
  }
  category.status = status;
  category.position = parseInt(position);
  category.description = description;
  category.updatedBy.push({
    account_id: req.admin._id,
    updatedAt: new Date()
  });

  await category.save();

  req.flash('success', `Cập nhật <strong> ${title} </strong> thành công!`);
  res.redirect('/admin/product-categories');
}

// [PATCH] /admin/product-categories/change-multi
module.exports.changeMulti = async (req, res, next) => {
  const type = req.body.type;
  const ids = req.body.ids.split(',');

  const updatedBy = {
    account_id: req.admin._id,
    updatedAt: new Date()
  };

  switch (type) {
    case "active":
    case "inactive":
      await ProductCategory.updateMany({
        _id: {
          $in: ids
        }
      }, {
        status: type,
        $push: {
          updatedBy
        }
      });
      req.flash('success', `Cập nhật trạng thái ${ids.length} danh mục thành công!`);
      break;
    case "delete-all":
      await ProductCategory.updateMany({
        _id: {
          $in: ids
        }
      }, {
        deleted: true,
        deletedBy: {
          account_id: req.admin._id,
          deletedAt: new Date()
        }
      });
      req.flash('success', `Xóa ${ids.length} danh mục thành công!`);
      break;
  };
  res.redirect('back');
}