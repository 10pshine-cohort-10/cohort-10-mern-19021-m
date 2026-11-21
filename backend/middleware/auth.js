const jwt = require('jsonwebtoken');

/**
 * @param {import('express').Request & { userId?: string }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = /^Bearer /i.test(header) ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};