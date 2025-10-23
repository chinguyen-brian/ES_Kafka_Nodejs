import { RequestValidator } from "./../utils/requestValidator";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "../dto/product.dto.js";
import { CatalogService } from "../services/catalog.service.js";
import { CatalogRepository } from "../repository/catalog.repository.js";

const router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

router.post(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        CreateProductRequest,
        req.body
      );

      if (errors) return res.status(400).json(errors);

      const data = await catalogService.createProduct(input);
      res.status(201).json(data);
    } catch (error) {
      return next(error);
    }
  }
);

router.patch(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        UpdateProductRequest,
        req.body
      );

      const id = parseInt(req.params.id) || 0;
      if (errors) return res.status(400).json(errors);
      const data = await catalogService.updateProduct({ id, ...input });
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);
    try {
      const data = await catalogService.getProducts(limit, offset);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id) || 0;
    try {
      const data = await catalogService.getProductById(id);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id) || 0;
    try {
      const data = await catalogService.deleteProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
