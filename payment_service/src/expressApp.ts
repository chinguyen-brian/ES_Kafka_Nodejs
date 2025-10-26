import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.route";
import { HandleErrorWithLogger, httpLogger } from "./utils";
import { InitializeBroker } from "./service/broker.service";

export const ExpressApp = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(httpLogger);

  await InitializeBroker();

  app.use(paymentRoutes);

  app.use(HandleErrorWithLogger);

  return app;
};
