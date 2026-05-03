const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const env = require("../config/env");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authentication token is missing");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub }
    });

    if (!user || !user.isActive) {
      const error = new Error("Invalid or inactive user");
      error.statusCode = 401;
      throw error;
    }

    const { passwordHash, ...safeUser } = user;

    req.user = safeUser;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles
};