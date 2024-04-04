const Admin = require('../../models/admin.model');

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