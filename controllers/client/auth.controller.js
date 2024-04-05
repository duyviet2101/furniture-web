const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const systemConfig = require('../../config/system.config.js');
const jwt = require('jsonwebtoken');

// [GET] /auth/signup
module.exports.signup = async (req, res, next) => {
  res.render("client/pages/auth/signup");
}

// [POST] /auth/signup
module.exports.postSignup = async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    confirmPassword,
  } = req.body;
  
  if (!email || !password || !fullName) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin!");
    return res.redirect("back");
  }

  if (password !== confirmPassword) {
    req.flash("error", "Mật khẩu không khớp!");
    return res.redirect("back");
  }

  if (password.length < 8) {
    req.flash("error", "Mật khẩu phải có ít nhất 8 ký tự!");
    return res.redirect("back");
  }

  const user = await User.findOne({
    email: email,
  });

  if (user) {
    req.flash("error", "Email đã tồn tại!");
    return res.redirect("back");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName: fullName,
    email: email,
    password: hashPassword,
  });

  await newUser.save();

  req.flash("success", "Đăng ký thành công!");
  res.redirect("/auth/login");
}

// [GET] /auth/login
module.exports.login = async (req, res, next) => {
  res.render("client/pages/auth/login");
}

// [POST] /auth/login
module.exports.postLogin = async (req, res, next) => {
  const { email, password, rememberMe} = req.body;
  const user = await User.findOne({ 
    email: email,
    deleted: false ,
    status: 'active'
  });
  
  if (!user) {
    req.flash('error', 'Email không tồn tại hoặc tài khoản đã bị khóa!');
    return res.redirect("back");
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    req.flash('error', 'Mật khẩu không đúng!');
    return res.redirect("back");
  }

  const accessToken = await jwt.sign({ 
    id: user._id,
    email: user.email
  }, systemConfig.secretKeyAccessToken, {
    algorithm: 'HS256',
    expiresIn: systemConfig.accessTokenLife
    // expiresIn: "30s"
  });

  let refreshToken = await jwt.sign({
    id: user._id,
    email: user.email
  }, systemConfig.secretKeyRefreshToken, {
    algorithm: 'HS256',
    expiresIn: systemConfig.refreshTokenLife
    // expiresIn: "1m"
  });

  if (!user.refreshToken) { 
    user.refreshToken = refreshToken;
    await user.save();
  } else {
    try {
      await jwt.verify(user.refreshToken, systemConfig.secretKeyRefreshToken);
    } catch (error) {
      user.refreshToken = refreshToken;
      await user.save();
    }
    refreshToken = user.refreshToken;
  }

  res.cookie('accessTokenUser', accessToken, {
    maxAge: rememberMe == "true" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    httpOnly: true
  });

  res.cookie('refreshTokenUser', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000 || systemConfig.refreshTokenLife,
    // maxAge: 60 * 60 * 1000,
    httpOnly: true
  });

  res.redirect(`/`);
}

// [GET] /auth/logout
module.exports.logout = async (req, res, next) => {
  res.clearCookie('accessTokenUser');
  res.clearCookie('refreshTokenUser');
  res.redirect('/');
}