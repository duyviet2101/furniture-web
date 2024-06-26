const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const systemConfig = require('../../config/system.config.js');
const Admin = require('../../models/admin.model.js')

//  [GET] /admin/auth/login
module.exports.login = async (req, res, next) => {
  res.render('admin/pages/auth/login', {
    pageTitle: 'Đăng nhập'
  });
}

// [POST] /admin/auth/login
module.exports.postLogin = async (req, res, next) => {
  const { email, password, rememberMe} = req.body;
  const admin = await Admin.findOne({ 
    email: email,
    deleted: false ,
    status: 'active'
  });
  
  if (!admin) {
    req.flash('error', 'Email không tồn tại hoặc tài khoản đã bị khóa!');
    return res.redirect("back");
  }

  const checkPassword = await bcrypt.compare(password, admin.password);
  if (!checkPassword) {
    req.flash('error', 'Mật khẩu không đúng!');
    return res.redirect("back");
  }

  const accessToken = await jwt.sign({ 
    id: admin._id,
    email: admin.email
  }, systemConfig.secretKeyAccessToken, {
    algorithm: 'HS256',
    expiresIn: systemConfig.accessTokenLife
    // expiresIn: "30s"
  });

  let refreshToken = await jwt.sign({
    id: admin._id,
    email: admin.email
  }, systemConfig.secretKeyRefreshToken, {
    algorithm: 'HS256',
    expiresIn: systemConfig.refreshTokenLife
    // expiresIn: "1m"
  });

  if (!admin.refreshToken) { 
    admin.refreshToken = refreshToken;
    await admin.save();
  } else {
    try {
      await jwt.verify(admin.refreshToken, systemConfig.secretKeyRefreshToken);
    } catch (error) {
      admin.refreshToken = refreshToken;
      await admin.save();
    }
    refreshToken = admin.refreshToken;
  }

  res.cookie('accessToken', accessToken, {
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    httpOnly: true
  });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000 || systemConfig.refreshTokenLife,
    // maxAge: 60 * 60 * 1000,
    httpOnly: true
  });

  res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res, next) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}