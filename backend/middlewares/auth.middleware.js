module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if session exists
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    //  Set the userId on the request object
    req.userId = req.session.userId;

    // Optional: Role-based access control (extend if needed)
    // Example: if you want to restrict certain routes to admins only
    if (roles.length > 0) {
      const userRole = req.session.role; // Make sure role is also stored in session
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
    }

    next();
  };
};

  