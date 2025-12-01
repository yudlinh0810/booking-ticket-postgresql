import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(process.env.PASS_SUPER_ADMIN!, 10);

  await prisma.user.upsert({
    where: { email: process.env.USER_NAME_SUPER_ADMIN! },
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

  console.log("Super admin created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
