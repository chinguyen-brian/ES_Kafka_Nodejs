import express from "express";
import catalogRouter from "./api/catalog.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(catalogRouter);

app.get("/", (req, res, next) => {
  return res.json({ msg: "Message" });
});

export default app;
