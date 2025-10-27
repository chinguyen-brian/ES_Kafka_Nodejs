import express from "express";
import catalogRouter from "./api/catalog.routes.js";
import { httpLogger, HandleErrorWithLogger, AppEventListener } from "./utils";
import { ElasticSearchService } from "./services/elasticSearch.service.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

const elasticSearchService = new ElasticSearchService();
AppEventListener.instance.listen(elasticSearchService);

app.use("/", catalogRouter);

app.use(HandleErrorWithLogger);

export default app;
