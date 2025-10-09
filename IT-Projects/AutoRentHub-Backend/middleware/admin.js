const adminOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.'
    });
  }
};

const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.userType === 'admin' || req.user.userType === 'staff')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Staff or Administrator privileges required.'
    });
  }
};

module.exports = { adminOnly, staffOrAdmin };
