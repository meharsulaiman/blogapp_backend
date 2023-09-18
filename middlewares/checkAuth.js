const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  console.log('authToken', authToken);
  console.log('refreshToken', refreshToken);

  if (!authToken || !refreshToken) {
    return res.status(401).json({
      message: 'You are not logged in!',
    });
  }

  jwt.verify(authToken, process.env.JWT_SECRET_KEY, (error, decoded) => {
    if (error) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
        (refreshTokenError, refreshTokenDecoded) => {
          if (refreshTokenError) {
            return res.status(401).json({
              message: 'You are not logged in!',
            });
          } else {
            const newAuthToken = jwt.sign(
              { userId: refreshTokenDecoded.userId },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '10m' }
            );
            const newRefreshToken = jwt.sign(
              { userId: refreshTokenDecoded.userId },
              process.env.JWT_REFRESH_SECRET_KEY,
              { expiresIn: '40m' }
            );

            res.cookie('authToken', newAuthToken, { httpOnly: true });
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
            req.userId = refreshTokenDecoded.userId;
            next();
          }
        }
      );
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
}

module.exports = checkAuth;
