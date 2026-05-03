const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { generateToken } = require("../utils/jwt");

const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "USER_REGISTERED",
      entity: "User",
      entityId: user.id,
      metadata: {
        email: user.email,
        role: user.role
      }
    }
  });

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
};

const loginUser = async ({ email, password, ipAddress }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.isActive) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      ipAddress,
      metadata: {
        email: user.email,
        role: user.role
      }
    }
  });

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
};

module.exports = {
  registerUser,
  loginUser
};