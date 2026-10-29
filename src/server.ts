import app from "./app.js";
import prisma from "./config/prisma.js";
import logger from "./config/logger.js";

import "./modules/podcasts/subtitle/subtitle.worker.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info(" DB connected");


    logger.info("Redis (cache) connected");
    logger.info("Redis (BullMQ) connected");

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();