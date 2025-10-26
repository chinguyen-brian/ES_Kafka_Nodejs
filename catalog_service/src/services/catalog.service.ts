import type { ICatalogRepository } from "../interface/catalogRepository.interface.js";
import type { Product } from "../models/product.model.js";
import { CatalogEvent, MessageType } from "../types/broker.type.js";
import { OrderWithLineItems } from "../types/message.type.js";

export class CatalogService {
  private _repository: ICatalogRepository;

  constructor(repository: ICatalogRepository) {
    this._repository = repository;
  }

  async createProduct(input: Product) {
    const data = await this._repository.create(input);
    if (!data.id) {
      throw new Error("Unable to create product");
    }
    return data;
  }

  async updateProduct(input: Product) {
    const data = await this._repository.update(input);
    //TODO: emit event to update record in Elastic Search
    return data;
  }

  //TODO: instead of this we will get product from Elastic search
  async getProducts(limit: number, offset: number) {
    const products = await this._repository.find(limit, offset);

    return products;
  }

  async getProductById(id: number) {
    const product = await this._repository.findOne(id);
    return product;
  }

  async deleteProduct(id: number) {
    const response = await this._repository.delete(id);
    //TODO: Delete record from Elastic Search
    return response;
  }

  async getProductStock(ids: number[]) {
    const products = await this._repository.findStockByIds(ids);
    if (!products) {
      throw new Error("Unable to fetch product stock");
    }
    return products;
  }

  async HandleBrokerMessage(message: MessageType) {
    console.log("Catalog service received message:", message);
    const orderData = message.data as OrderWithLineItems;
    const { orderItems } = orderData;
    orderItems.forEach(async (item) => {
      console.log("Updating stock for product", item.productId, item.qty);
      const product = await this._repository.findOne(item.productId);
      if (!product) {
        console.log(
          "Product not found error during stock update",
          item.productId
        );
      } else {
        let updatedStock = 0;
        if (message.event == CatalogEvent.CREATE_ORDER) {
          updatedStock = product.stock - item.qty;
        } else if (message.event == CatalogEvent.CANCEL_ORDER) {
          updatedStock = product.stock + item.qty;
        }
        console.log(`Update stock with ${message.event} event`);

        await this.updateProduct({ ...product, stock: updatedStock });
      }
    });
  }
}
