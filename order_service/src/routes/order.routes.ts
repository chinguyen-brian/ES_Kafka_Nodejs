import express, { NextFunction, Request, Response } from "express";
import { MessageBroker } from "../utils/broker";
import { OrderEvent, OrderStatus } from "../types";
import { RequestAuthorizer } from "./middleware";
import * as service from "../service/order.service";
import { OrderRepository } from "../repository/order.repository";
import { CartRepository } from "../repository/cart.repository";

const router = express.Router();
const repo = OrderRepository;
const cartRepo = CartRepository;

router.post(
  "/orders",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    //Order create logic
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const response = await service.CreateOrder(user.id, repo, cartRepo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/orders",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const response = await service.GetOrdersByCustomerId(user.id, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/orders/:id",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const orderId = parseInt(req.params.id);
      const response = await service.GetOrder(orderId, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// only going to call from microservices
router.patch(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //TODO: security check for microservice calls only
      const orderId = parseInt(req.params.id);
      const status = req.body.status as OrderStatus;
      const response = await service.UpdateOrder(orderId, status, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// only going to call from microservices
router.delete(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const orderId = parseInt(req.params.id);
      const response = await service.DeleteOrder(orderId, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/orders/:id/checkout",
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.id);
    const response = await service.CheckoutOrder(orderId, repo);
    return res.status(200).json(response);
  }
);

export default router;
