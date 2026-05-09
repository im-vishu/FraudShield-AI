/* eslint-disable no-console */
const bcrypt = require("bcryptjs");
const prisma = require("../src/config/db");

async function upsertUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      isActive: true,
      passwordHash
    },
    create: {
      name,
      email,
      role,
      isActive: true,
      passwordHash
    }
  });
  return user;
}

async function main() {
  const password = process.env.SEED_PASSWORD || "sentinel1234";

  const admin = await upsertUser({
    name: "Sentinel Admin",
    email: "admin@sentinel.io",
    password,
    role: "ADMIN"
  });

  const analyst = await upsertUser({
    name: "Sentinel Analyst",
    email: "analyst@sentinel.io",
    password,
    role: "ANALYST"
  });

  console.log("Seeded users:");
  console.log(`- ADMIN  ${admin.email}`);
  console.log(`- ANALYST ${analyst.email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

