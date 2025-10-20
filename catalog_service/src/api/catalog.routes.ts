import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { RequestValidator } from "../utils/requestValidator.js";
import { CreateProductRequest } from "../dto/product.dto.js";
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
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

export default router;
