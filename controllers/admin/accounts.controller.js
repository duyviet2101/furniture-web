const Admin = require('../../models/admin.model');
const Role = require('../../models/role.model');

const bcrypt = require('bcrypt');

// [GET] /admin/accounts
module.exports.index = async (req, res, next) => {
  const accounts = await Admin.aggregate([
    {
      $match: {
        deleted: false
      }
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role_id',
        foreignField: '_id',
        as: 'role'
      }
    },
    {
      $unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        email: 1,
        fullName: 1,
        status: 1,
        avatar: 1,
        role: '$role.title'
      }
    }
  ]);
  res.render('admin/pages/accounts/index', {
    pageTitle: 'Accounts',
    activeTab: 'accounts',
    accounts
  })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res, next) => {
  const roles = await Role.find({
    deleted: false,
    status: 'active'
  }).lean();
  res.render('admin/pages/accounts/create', {
    pageTitle: 'Create Account',
    activeTab: 'accounts',
    roles
  })
}

// [POST] /admin/accounts/create
module.exports.postCreate = async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phone,
    avatar,
    status,
    role_id
  } = req.body;

  if (!fullName || !email || !password || !status || !role_id) {
    req.flash('error', 'Thiếu thông tin!');
    return res.redirect('/admin/accounts/create')
  }

  const account = await Admin.findOne({
    email
  });

  if (account) {
    req.flash('error', 'Email đã tồn tại!');
    return res.redirect('/admin/accounts/create')
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newAccount = new Admin({
    fullName,
    email,
    password: hashPassword,
    phone,
    avatar,
    status,
    role_id
  });

  await newAccount.save();

  req.flash('success', 'Tạo tài khoản thành công!');
  res.redirect('/admin/accounts');
}