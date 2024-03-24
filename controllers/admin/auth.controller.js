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
    deleted: false 
  });
  
  if (!admin) {
    return res.redirect("back");
  }

  const checkPassword = bcrypt.compare(password, admin.password);
  if (!checkPassword) {
    return res.redirect("back");
  }

  const accessToken = jwt.sign({ 
    id: admin._id,
    email: admin.email
  }, systemConfig.secretKeyAccessToken, {
    algorithm: 'HS256',
    expiresIn: systemConfig.accessTokenLife
    // expiresIn: "30s"
  });

  let refreshToken = jwt.sign({
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
      jwt.verify(admin.refreshToken, systemConfig.secretKeyRefreshToken);
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
    maxAge: systemConfig.refreshTokenLife,
    // maxAge: 60 * 60 * 1000,
    httpOnly: true
  });

  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}