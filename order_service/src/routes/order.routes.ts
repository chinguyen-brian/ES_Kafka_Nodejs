import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post(
  "/order",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "Create order" });
  }
);

router.get(
  "/order",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "Get order" });
  }
);

router.get(
  "/order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "Get order" });
  }
);

router.delete(
  "/order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "delete order" });
  }
);

export default router;
