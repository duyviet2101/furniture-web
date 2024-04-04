const Role = require('../../models/role.model.js');

const rbac = require('./roles.middleware.js');

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne({
        _id: req.admin.role_id
      });

      const permission = rbac.can(role.title)[action](resource);

      if (!permission.granted) {
        throw new Error('Permission denied');
      }
      next();
    }
    catch (error) {
      next(error);
    }
  }
}

module.exports = {
  grantAccess
}