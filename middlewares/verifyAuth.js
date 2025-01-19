const jwt = require("jsonwebtoken");
const jwtUtils = require("../utils/jwtUtils");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtUtils.getJwtSecret());
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    console.error("Token verification error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { verifyToken };
