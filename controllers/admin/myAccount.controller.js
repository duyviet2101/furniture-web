const Admin = require("../../models/admin.model");

// [GET] /admin/myAccount
module.exports.index = async (req, res, next) => {
  res.render("admin/pages/myAccount/index", {
    pageTitle: "My Account"
  });
};