// --- VERIFY TOKEN + ROLE MIDDLEWARE ---
const jwt = require("jsonwebtoken");

// Middleware to verify token and enforce role-based access
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).send("Access denied: Token missing or malformed");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send("Invalid or expired token");
      }

      req.user = { userId: decoded.userId, role: decoded.role };

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).send("Access denied: insufficient role");
      }

      next();
    });
  };
};

module.exports = { authorizeRole };