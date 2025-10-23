import axios from "axios";
import { logger } from "../logger";
import { CATALOG_BASE_URL } from "../../config";
import { APIError } from "../error";
import { Product } from "../../dto/product.dto";

const CATALOG_URL = CATALOG_BASE_URL || "http://localhost:9001";

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(`${CATALOG_URL}/products/${productId}`);
    return response.data as Product;
  } catch (error) {
    logger.error(error);
    throw new APIError("Product not found");
  }
};
