import { Producer } from "kafkajs";
import { MessageBroker } from "../utils/broker";
import { PaymentEvent } from "../types";

// init the broker
export const InitializeBroker = async () => {
  const producer = await MessageBroker.connectProducer<Producer>();
  producer.on("producer.connect", async () => {
    console.log("Order Producer connected successfully");
  });
};

// publish dedicated events based on use cases
export const SendPaymentUpdateMessage = async (data: unknown) => {
  await MessageBroker.publish({
    event: PaymentEvent.UPDATE_PAYMENT,
    topic: "OrderEvents",
    headers: {},
    message: { data },
  });
};
