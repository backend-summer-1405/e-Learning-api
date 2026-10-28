import { env } from "node:process";
import app from "./app.js";
import logger from "./config/logger.js";
import prisma from "./config/prisma.js"


const start = async () => {
  try {
    await prisma.$connect();
    logger.info("DB conected")

    app.listen(env.PORT, () => {
      logger.info(`server running on http/:localhost ${env.PORT}`)
    })

  } catch (err) {
    logger.error(err);
    process.exit(1)
  }
}

start();