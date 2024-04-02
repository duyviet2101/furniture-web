const Role = require('../../models/role.model.js')
const Admin = require('../../models/admin.model.js')

// [GET] /admin/rbac/roles
module.exports.roles = async (req, res, next) => {
  const roles = await Role.find({
    deleted: false
  }).lean();

  for (let role of roles) {
    const createdBy = {};
    if (role.createdBy.account_id) {
      createdBy.accountInfo = await Admin.findById(role.createdBy.account_id)
                                .select('_id fullName email')
                                .lean();
      createdBy.createdAt = role.createdBy.createdAt;
    }
    role.createdBy = createdBy;

    const updatedBy = {};
    if (role.updatedBy.length > 0) {
      updatedBy.accountInfo = await Admin.findById(role.updatedBy[role.updatedBy.length - 1].account_id)
                                .select('_id fullName email')
                                .lean();
      updatedBy.updatedAt = role.updatedBy[role.updatedBy.length - 1].updatedAt;
    }
    role.updatedBy = updatedBy;
  };

  res.render('admin/pages/roles/index', {
    pageTitle: 'Roles',
    activeTab: 'roles',
    roles
  })
}

// [GET] /admin/rbac/roles/create
module.exports.createRoles = async (req, res, next) => {
  res.render('admin/pages/roles/create', {
    pageTitle: 'Create Role',
    activeTab: 'roles'
  })
}

// [POST] /admin/rbac/roles/create
module.exports.postRoles = async (req, res, next) => {
  const { title, status, description } = req.body
  const role = new Role({
    title,
    status,
    description,
    createdBy: {
      account_id: req.admin._id,
      createdAt: new Date()
    }
  })
  await role.save()
  res.redirect('/admin/rbac/roles')
}