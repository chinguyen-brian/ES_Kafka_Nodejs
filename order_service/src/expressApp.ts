import express, { Request, Response } from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(orderRoutes);
app.use(cartRoutes);

app.use("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Order Service Okay" });
});

export default app;
