const prisma = require("../config/db");

const getRiskContext = async ({ userId, payload }) => {
  const now = new Date();

  const last10Minutes = new Date(now.getTime() - 10 * 60 * 1000);
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    recentUserTransactionCount,
    dailyUserTransactionCount,
    sameDeviceCount,
    sameIpCount,
    userTransactionStats
  ] = await Promise.all([
    prisma.transaction.count({
      where: {
        userId,
        createdAt: {
          gte: last10Minutes
        }
      }
    }),

    prisma.transaction.count({
      where: {
        userId,
        createdAt: {
          gte: last24Hours
        }
      }
    }),

    payload.deviceId
      ? prisma.transaction.count({
          where: {
            deviceId: payload.deviceId,
            userId: {
              not: userId
            },
            createdAt: {
              gte: last30Days
            }
          }
        })
      : 0,

    payload.ipAddress
      ? prisma.transaction.count({
          where: {
            ipAddress: payload.ipAddress,
            createdAt: {
              gte: last24Hours
            }
          }
        })
      : 0,

    prisma.transaction.aggregate({
      where: {
        userId,
        createdAt: {
          gte: last30Days
        }
      },
      _avg: {
        amount: true
      },
      _count: {
        id: true
      }
    })
  ]);

  return {
    recentUserTransactionCount,
    dailyUserTransactionCount,
    sameDeviceUsedByOtherUsersCount: sameDeviceCount,
    sameIpTransactionCount24h: sameIpCount,
    userAverageAmount30d: userTransactionStats._avg.amount
      ? Number(userTransactionStats._avg.amount)
      : null,
    userTransactionCount30d: userTransactionStats._count.id
  };
};

module.exports = {
  getRiskContext
};