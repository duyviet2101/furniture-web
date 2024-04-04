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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res, next) => {
  const { id } = req.params;

  const account = await Admin.findOne
  ({
    _id: id,
    deleted: false
  });

  if (!account) {
    req.flash('error', 'Tài khoản không tồn tại!');
    return res.redirect('/admin/accounts');
  }

  const roles = await Role.find({
    deleted: false,
    status: 'active'
  });
  
  res.render('admin/pages/accounts/edit', {
    pageTitle: 'Edit Account',
    activeTab: 'accounts',
    account,
    roles
  })
}

// [POST] /admin/accounts/edit/:id
module.exports.postEdit = async (req, res, next) => {
  const { id } = req.params;
  const {
    fullName,
    email,
    phone,
    avatar,
    status,
    role_id,
    oldPassword,
    newPassword,
    confirmNewPassword
  } = req.body;

  if (!fullName || !email || !status || !role_id) {
    req.flash('error', 'Thiếu thông tin!');
    return res.redirect(`/admin/accounts/edit/${id}`)
  }

  const account = await Admin.findOne
  ({
    _id: id,
    deleted: false
  });

  if (!account) {
    req.flash('error', 'Tài khoản không tồn tại!');
    return res.redirect('/admin/accounts');
  }

  account.fullName = fullName;
  account.email = email;
  account.phone = phone;
  account.status = status;
  account.role_id = role_id;

  if (avatar) {
    account.avatar = avatar;
  }

  if (oldPassword && newPassword && confirmNewPassword) {
    if (newPassword !== confirmNewPassword) {
      req.flash('error', 'Mật khẩu mới không khớp!');
      return res.redirect(`/admin/accounts/edit/${id}`)
    }

    const isMatch = await bcrypt.compare(oldPassword, account.password);

    if (!isMatch) {
      req.flash('error', 'Mật khẩu cũ không đúng!');
      return res.redirect(`/admin/accounts/edit/${id}`)
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashPassword;
  }

  await account.save();

  req.flash('success', 'Cập nhật tài khoản thành công!');
  res.redirect('/admin/accounts');
}