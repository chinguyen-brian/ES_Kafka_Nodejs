import axios from "axios";
import { logger } from "../logger";
import { AUTH_SERVICE_BASE_URL, ORDER_BASE_URL } from "../../config";
import { APIError } from "../error";
import { User } from "../../dto/user.model";
import { InProcessOrder } from "../../dto/order.model";

export const GetOrderDetails = async (orderId: number) => {
  try {
    const response = await axios.get(
      `${ORDER_BASE_URL}/orders/${orderId}/checkout`
    );
    return response.data as InProcessOrder;
  } catch (error) {
    logger.error(error);
    throw new APIError("Order not found");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    // axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`, {
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
