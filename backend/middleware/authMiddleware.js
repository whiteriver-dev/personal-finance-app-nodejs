// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'fryingpan69';

const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1]; // split to get the token after "Bearer"

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Attach user information to request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;
