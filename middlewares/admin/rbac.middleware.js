const Role = require('../../models/role.model.js');

const rbac = require('./roles.middleware.js');

const {getGrants} = require('../../controllers/admin/rbac.controller.js');

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      console.log(await getGrants(req.admin.role_id));
      rbac.setGrants(await getGrants(req.admin.role_id));

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