import { Consumer, Producer } from "kafkajs";
import { MessageBroker } from "../utils/broker";
import { CatalogService } from "./catalog.service";

export class BrokerService {
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private catalogService: CatalogService;

  constructor(catalogService: CatalogService) {
    this.catalogService = catalogService;
  }

  //init the broker
  public async InitializeBroker() {
    this.producer = await MessageBroker.connectProducer<Producer>();
    this.producer.on("producer.connect", async () => {
      console.log("Catalog Producer connected successfully");
    });

    this.consumer = await MessageBroker.connectConsumer<Consumer>();
    this.consumer.on("consumer.connect", async () => {
      console.log("Catalog Consumer connected successfully");
    });

    // keep listening to consumers events
    // perform the action based on the event
    await MessageBroker.subscribe(
      this.catalogService.HandleBrokerMessage,
      "CatalogEvents"
    );
  }

  // publish discontinue product event
  public async sendDeleteProductMessage(data: any) {}
}
