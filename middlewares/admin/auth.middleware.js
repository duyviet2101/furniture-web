const Admin = require('../../models/admin.model.js');
const systemConfig = require('../../config/system.config.js');
const {cookieParser} = require('../../helpers/cookieFunctions.js');
const jwt = require('jsonwebtoken');

module.exports.requiredAuth = async (req, res, next) => {
  const {accessToken, refreshToken} = cookieParser(req);
  if (!accessToken || !refreshToken) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.redirect('/admin/auth/login');
  }

  try {
    const data = jwt.verify(accessToken, systemConfig.secretKeyAccessToken);
    
    const admin = await Admin.findOne({
      _id: data.id,
      email: data.email,
      refreshToken: refreshToken
    }).select('-_id -password -refreshToken -deleted -createdAt -updatedAt -__v').lean();

    if (!admin) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.redirect('/admin/auth/login');
    }

    req.admin = admin;

    next();
  } catch (error) {
    try {
      const data = jwt.verify(accessToken, systemConfig.secretKeyAccessToken, {
        ignoreExpiration: true
      });
      
      const admin = await Admin.findOne
      ({
        _id: data.id,
        email: data.email
      });

      if (!admin) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.redirect('/admin/auth/login');
      }

      const dataRefreshToken = jwt.verify(refreshToken, systemConfig.secretKeyRefreshToken);

      const newAccessToken = jwt.sign({
        id: admin._id,
        email: admin.email
      }, systemConfig.secretKeyAccessToken, {
        algorithm: 'HS256',
        expiresIn: systemConfig.accessTokenLife
        // expiresIn: "30s"
      });

      res.cookie('accessToken', newAccessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });

      next();
    } catch (error) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.redirect('/admin/auth/login');
    }
  }

}