// @desc  Restrict access to admins and superadmins
// @usage Apply AFTER the protect middleware
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admins only' });
};

// @desc  Restrict access to superadmin only
// @usage Apply AFTER the protect middleware
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Super Admin only' });
};

module.exports = { adminOnly, superAdminOnly };
