import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "./src/config/prisma.js";

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME ?? "Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("This email already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("Admin created successfully:", admin);
};

try {
  await createAdmin();
} catch (error) {
  console.error("Failed to create admin:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}