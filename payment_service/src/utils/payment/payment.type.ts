export type PaymentGateway = {
  createPayment: (
    amount: number,
    metadata: { orderId: number; userId: number }
  ) => Promise<{ secret: string; pubkey: string; amount: number }>;
  getPayment: (paymentId: string) => Promise<Record<string, unknown>>;
};
