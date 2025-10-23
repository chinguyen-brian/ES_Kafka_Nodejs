import { CartRepository } from "./../repository/cart.repository";
import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";

const router = express.Router();
const repo = CartRepository;

const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  //jwt
  const isValidUser = true;
  if (!isValidUser) {
    return res.status(403).json({ error: "Authorization Error" });
  }
  next();
};

router.use(authMiddleWare);

router.post(
  "/cart",
  authMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const error = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );
      if (error) {
        return res.status(404).json({ error });
      }

      const response = await service.CreateCart(
        req.body as CartRequestInput,
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
);

router.get("/cart", async (req: Request, res: Response, next: NextFunction) => {
  // comes from our auth user parsed from JWT
  const response = await service.GetCart(req.body.customerId, repo);
  return res.status(200).json(response);
});

router.patch(
  "/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.lineItemId;
    const response = await service.EditCart(
      { id: +lineItemId, qty: req.body.qty },
      repo
    );
    return res.status(200).json(response);
  }
);

router.delete(
  "/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.lineItemId;
    const response = await service.DeleteCart(+lineItemId, repo);
    return res.status(200).json(response);
  }
);

router.delete(
  "/cart",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = 0
    const response = await service.ClearCartData(id, repo);
    return res.status(200).json(response);
  }
);

export default router;
