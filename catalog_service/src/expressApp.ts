import express from "express";
import catalogRouter from "./api/catalog.routes.js";
import { httpLogger, HandleErrorWithLogger } from "./utils";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

app.use("/", catalogRouter);

app.use(HandleErrorWithLogger);

export default app;
