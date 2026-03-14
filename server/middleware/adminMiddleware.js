// @desc  Restrict access to admins only
// @usage Apply AFTER the protect middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admins only' });
};

module.exports = { adminOnly };
