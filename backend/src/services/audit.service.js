const prisma = require("../config/db");

const listAuditLogs = async ({ user, limit = 30, page = 1, action }) => {
  const take = Math.min(Number(limit) || 30, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const isPrivileged = user.role === "ADMIN" || user.role === "ANALYST";

  const where = isPrivileged ? {} : { userId: user.id };
  if (action) where.action = action;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    }),
    prisma.auditLog.count({ where })
  ]);

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take)
    }
  };
};

module.exports = {
  listAuditLogs
};

