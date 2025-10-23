import type { ICatalogRepository } from "../interface/catalogRepository.interface.js";
import type { Product } from "../models/product.model.js";

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

  async getProductStock(ids: number[]){
    const products = await this._repository.findStockByIds(ids);
    if(!products){
      throw new Error("Unable to fetch product stock");
    }
    return products;
  }
}
