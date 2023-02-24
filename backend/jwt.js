const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader)

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware
