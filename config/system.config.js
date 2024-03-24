module.exports = {
  prefixAdmin: process.env.PREFIX_ADMIN || 'admin',
  secretKeyAccessToken: process.env.ACCESS_TOKEN_SECRET,
  secretKeyRefreshToken: process.env.REFRESH_TOKEN_SECRET,
  accessTokenLife: process.env.ACCESS_TOKEN_LIFE || '24h',
  refreshTokenLife: process.env.REFRESH_TOKEN_LIFE || '7d',
}