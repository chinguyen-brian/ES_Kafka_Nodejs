import { APP_PORT } from "./config/index.js";
import { ExpressApp } from "./expressApp.js";
import { logger } from "./utils";
const PORT = APP_PORT || 9000;

export const StartServer = async () => {
  const expressApp = await ExpressApp()
  expressApp.listen(PORT, () => {
    logger.info(`App is listening to ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    logger.error(err);
    process.exit(1);
  });

  return expressApp;
};

StartServer().then(() => {
  logger.info("Server is up");
});
