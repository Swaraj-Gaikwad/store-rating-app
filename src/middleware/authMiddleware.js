const jwt = require("jsonwebtoken");

// Verify Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  

  // Check if header exists
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Expected format: "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token missing" });
  }

  jwt.verify(token, "SECRET_KEY", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded; // attach user info
    next();
  });
};

// Role Check
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

exports.isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access required" });
  }
  next();
};

exports.isStoreOwner = (req, res, next) => {
  if (req.user.role !== "store_owner") {
    return res.status(403).json({ message: "Store Owner access required" });
  }
  next();
};