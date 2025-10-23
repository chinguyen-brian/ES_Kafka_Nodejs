import { APP_PORT } from "./config/index.js";
import expressApp from "./expressApp.js";
import {logger} from "./utils";

const PORT = APP_PORT || 9001;

export const StartServer = async () => {
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
  logger.info( "Server is up");
});
