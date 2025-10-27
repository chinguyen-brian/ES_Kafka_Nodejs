import Stripe from "stripe";
import { PaymentGateway } from "./payment.type";
import { STRIPE_SECRET_KEY, STRIPE_PUBLISH_KEY } from "../../config";

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

const createPayment = async (
  amount: number,
  metadata: { orderId: number; userId: number }
): Promise<{ secret: string; pubkey: string; amount: number }> => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata,
  });
  return {
    secret: paymentIntent.client_secret as string,
    pubkey: STRIPE_PUBLISH_KEY as string,
    amount: paymentIntent.amount,
  };
};

const getPayment = async (
  paymentId: string
): Promise<Record<string, unknown>> => {
  const paymentResponse = await stripe.paymentIntents.retrieve(paymentId, {});
  console.log(paymentResponse);
  const { status } = paymentResponse;
  return { status, paymentLog: paymentResponse };
};

export const StripePayment: PaymentGateway = {
  createPayment,
  getPayment,
};
