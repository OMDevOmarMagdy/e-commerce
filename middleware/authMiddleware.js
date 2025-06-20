const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================================================
// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user || !req.user.isVerified)
      return res.status(401).json({ message: "User not verified" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ==========================================================================
// Admin-only access
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

// ==========================================================================
