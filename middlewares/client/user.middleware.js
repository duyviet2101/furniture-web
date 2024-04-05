const User = require('../../models/user.model.js');
const systemConfig = require('../../config/system.config.js');
const {
  cookieParser
} = require('../../helpers/cookieFunctions.js');
const jwt = require('jsonwebtoken');

module.exports.getInfoUser = async (req, res, next) => {
  const {
    accessTokenUser,
    refreshTokenUser
  } = cookieParser(req);
  if (!accessTokenUser || !refreshTokenUser) {
    res.clearCookie('accessTokenUser');
    res.clearCookie('refreshTokenUser');
    return next();
  }

  try {
    const data = jwt.verify(accessTokenUser, systemConfig.secretKeyAccessToken);

    const user = await User.findOne({
      _id: data.id,
      refreshToken: refreshTokenUser,
      deleted: false,
      status: 'active'
    }).select('-password -refreshToken -deleted -createdAt -updatedAt -__v').lean();

    if (!user) {
      res.clearCookie('accessTokenUser');
      res.clearCookie('refreshTokenUser');
      return next();
    }

    req.user = user;
    res.locals.user = user;

    next();
  } catch (error) {
    try {
      const data = jwt.verify(accessTokenUser, systemConfig.secretKeyAccessToken, {
        ignoreExpiration: true
      });

      const user = await User.findOne({
        _id: data.id
      });

      if (!user) {
        res.clearCookie('accessTokenUser');
        res.clearCookie('refreshTokenUser');
        return next();
      }

      const dataRefreshToken = jwt.verify(refreshTokenUser, systemConfig.secretKeyRefreshToken);

      const newAccessTokenUser = jwt.sign({
        id: user._id,
        email: user.email
      }, systemConfig.secretKeyAccessToken, {
        algorithm: 'HS256',
        expiresIn: systemConfig.accessTokenLife
        // expiresIn: "30s"
      });

      const newRefreshTokenUser = jwt.sign({
        id: user._id,
        email: user.email
      }, systemConfig.secretKeyRefreshToken, {
        algorithm: 'HS256',
        expiresIn: systemConfig.refreshTokenLife
        // expiresIn: "1m"
      });

      res.cookie('accessTokenUser', newAccessTokenUser, {
        maxAge: systemConfig.accessTokenLife,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });

      res.cookie('refreshTokenUser', newRefreshTokenUser, {
        maxAge: systemConfig.refreshTokenLife,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });

      req.user = user;
      res.locals.user = user;

      next();
    }
    catch (error) {
      res.clearCookie('accessTokenUser');
      res.clearCookie('refreshTokenUser');
      return next();
    }
  }
}