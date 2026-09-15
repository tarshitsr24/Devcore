const isApplicant = (req, res, next) => {
  if (req.user && req.user.role === 'applicant') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Applicant account required.' });
};

const isOrganization = (req, res, next) => {
  if (req.user && (req.user.role === 'organization' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Organization account required.' });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
};

module.exports = {
  isApplicant,
  isOrganization,
  isAdmin
};
