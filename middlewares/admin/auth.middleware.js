const Admin = require('../../models/admin.model.js');
const systemConfig = require('../../config/system.config.js');
const cookieParser = require('../../helpers/cookieParse.js');
const jwt = require('jsonwebtoken');

module.exports.requiredAuth = async (req, res, next) => {
  const {accessToken, refreshToken} = cookieParser.cookieParse(req);
  if (!accessToken || !refreshToken) {
    return res.redirect('/admin/auth/login');
  }

  try {
    const data = jwt.verify(accessToken, systemConfig.secretKeyAccessToken);
    
    const admin = await Admin.findOne({
      _id: data.id,
      email: data.email,
      refreshToken: refreshToken
    });

    if (!admin) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.redirect('/admin/auth/login');
    }

    req.admin = admin;

    next();
  } catch (error) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('/admin/auth/login');
  }

}