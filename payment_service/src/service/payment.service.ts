import { PaymentGateway } from "../utils";
import { GetOrderDetails } from "./../utils/broker/api";
export const CreatePayment = async (
  userId: number,
  orderId: number,
  paymentGateway: PaymentGateway
) => {
  // get order details
  const order = await GetOrderDetails(orderId);
  if (order.customerId !== userId) {
    throw new Error("User not authorised to create payment");
  }

  // create a new payment record
  paymentGateway.createPayment(order.amount, { orderId, userId });

  // call payment gateway

  //return payment secrets
  return {
    secret: "my super secret",
    pubKey: "my super public key",
    amount: 100,
  };
};

export const VerifyPayment = async (
  paymentId: string,
  paymentGateway: unknown
) => {
  // call payment gateway to verify payment
  // update order status through message broker
  // return payment status <= not accessory just for response to frontend
};
