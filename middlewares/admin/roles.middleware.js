const AccessControl = require('accesscontrol');

// let grantList = [
//   { role: 'Quản trị viên', resource: 'roles', action: 'create:any', attributes: '*' },
//   { role: 'Quản trị viên', resource: 'roles', action: 'read:any', attributes: '*' },
// ]

module.exports = new AccessControl();