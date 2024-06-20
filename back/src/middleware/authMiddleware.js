const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('token', token);
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const tokenWithoutBearer = token.replace('Bearer ', '');

  jwt.verify(tokenWithoutBearer, "your_secret_key", (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId;
    req.username = decoded.username;
    console.log('decoded', decoded);
    next();
  });
};

exports.verifySession = (req, res, next) => {
  console.log('session', req.session);

  if (!req.session.userId) {
    return res.status(403).json({ error: 'Not authenticated' });
  }

  req.userId = req.session.userId;
  req.username = req.session.username;
  next();
};
