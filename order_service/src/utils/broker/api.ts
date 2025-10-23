import axios from "axios";
import { logger } from "../logger";
import { AUTH_SERVICE_BASE_URL, CATALOG_BASE_URL } from "../../config";
import { APIError } from "../error";
import { Product } from "../../dto/product.dto";
import { User } from "../../dto/user.model";

const CATALOG_URL = CATALOG_BASE_URL || "http://localhost:9001";

const AUTH_SERVICE_URL = AUTH_SERVICE_BASE_URL || "http://localhost:9000";

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(`${CATALOG_URL}/products/${productId}`);
    return response.data as Product;
  } catch (error) {
    logger.error(error);
    throw new APIError("Product not found");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    // axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/validate`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status !== 200) {
      throw new APIError("Unauthorized");
    }
    return response.data as User;
  } catch (error) {
    throw new APIError("Unauthorized");
  }
};
