import { APP_PORT } from "./config/index.js";
import expressApp from "./expressApp.js";

const PORT = APP_PORT || 9001;

export const StartServer = async () => {
  expressApp.listen(PORT, () => {
    console.log(`App is listening to ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    console.log(err);
    process.exit(1);
  });

  return expressApp;
};

StartServer().then(() => {
  console.log("Server is up");
});
