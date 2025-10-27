import { PaymentGateway } from "../utils";
import { GetOrderDetails } from "./../utils/broker/api";
import { SendPaymentUpdateMessage } from "./broker.service";
export const CreatePayment = async (
  userId: number,
  orderNumber: number,
  paymentGateway: PaymentGateway
) => {
  // get order details
  const order = await GetOrderDetails(orderNumber);
  if (order.customerId !== userId) {
    throw new Error("User not authorised to create payment");
  }

  // call payment gateway
  const amountInCents = order.amount * 100;
  const orderMetadata = {
    orderNumber: order.orderNumber,
    userId: userId,
  };
  const paymentResponse = await paymentGateway.createPayment(
    amountInCents,
    orderMetadata
  );

  return paymentResponse;
};

export const VerifyPayment = async (
  paymentId: string,
  paymentGateway: PaymentGateway
) => {
  // call payment gateway to verify payment
  const paymentResponse = await paymentGateway.getPayment(paymentId);
  console.log("Payment status:", paymentResponse.status);
  console.log("Payment log", paymentResponse.paymentLog);

  // update order status through message broker
  const response = await SendPaymentUpdateMessage({
    orderNumber: paymentResponse.orderNumber,
    status: paymentResponse.status,
    paymentLog: paymentResponse.paymentLog,
  });
  console.log("Message Broker response", response);

  // return payment status <= not accessory just for response to frontend
  return {
    message: "Payment verified",
    status: paymentResponse.status,
    paymentLog: paymentResponse.paymentLog,
  };
};
