import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL +
        (process.env.DATABASE_URL?.includes("?") ? "&" : "?") +
        "connection_limit=1",
    },
  },
});

async function main() {
  if (!process.env.PASS_SUPER_ADMIN || !process.env.USER_NAME_SUPER_ADMIN) {
    throw new Error("Missing environment variables for seeding.");
  }

  const password = await bcrypt.hash(process.env.PASS_SUPER_ADMIN, 10);

  console.log("Seeding super admin...");

  await prisma.user.upsert({
    where: { email: process.env.USER_NAME_SUPER_ADMIN },
    update: {},
    create: {
      email: "yudlinhsp@system.com",
      username: "yudlinhsp",
      password,
      role: "super_admin",
      first_name: "Super",
      last_name: "Admin",
    },
  });

  console.log("Super admin created successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
