import { PrismaClient } from "@prisma/client";
import { withPgTrgm } from "prisma-extension-pg-trgm";

const prisma = new PrismaClient().$extends(
  withPgTrgm({ logQueries: false })
);

export default prisma;