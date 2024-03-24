const Admin = require("../../models/admin.model");
const bcrypt = require("bcrypt");

// [GET] /admin/myAccount
module.exports.index = async (req, res, next) => {
  res.render("admin/pages/myAccount/index", {
    pageTitle: "My Account"
  });
};

// [PATCH] /admin/myAccount
module.exports.update = async (req, res, next) => {
  const {
    fullName,
    email,
    avatar,
    phone,
    oldPassword,
    newPassword,
    confirmNewPassword
  } = req.body;

  const admin = await Admin.findOne({
    email: req.admin.email
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (fullName) {
    admin.fullName = fullName;
  }

  if (email) {
    admin.email = email;
  }

  if (phone) {
    admin.phone = phone;
  }

  if (avatar) {
    admin.avatar = avatar;
  }

  if (oldPassword && newPassword && confirmNewPassword) {
    if (!bcrypt.compareSync(oldPassword, admin.password)) {
      throw new Error("Old password is incorrect");
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error("New password and confirm new password are not match");
    }

    admin.password = bcrypt.hashSync(newPassword, 10);
  }

  await admin.save();

  res.redirect("/admin/myAccount");
};