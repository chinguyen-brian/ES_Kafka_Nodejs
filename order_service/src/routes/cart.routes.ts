import { CartRepository } from "./../repository/cart.repository";
import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";
import { RequestAuthorizer } from "./middleware";

const router = express.Router();
const repo = CartRepository;

router.post(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const error = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );
      if (error) {
        return res.status(404).json({ error });
      }

      const input: CartRequestInput = req.body;

      const response = await service.CreateCart(
        { ...input, customerId: user.id },
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({ error });
    }
  }
);

router.get(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    // comes from our auth user parsed from JWT
    const customerId = req.user?.id;
    const response = await service.GetCart(req.body.customerId, repo);
    return res.status(200).json(response);
  }
);

router.patch(
  "/cart/:lineItemId",
  RequestAuthorizer,
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
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.lineItemId;
    const response = await service.DeleteCart(+lineItemId, repo);
    return res.status(200).json(response);
  }
);

router.delete(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = 0;
    const response = await service.ClearCartData(id, repo);
    return res.status(200).json(response);
  }
);

export default router;
