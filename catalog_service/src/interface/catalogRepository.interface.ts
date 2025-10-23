import type { Product } from "../models/product.model.js";

export interface ICatalogRepository {
  create(data: Product): Promise<Product>;
  update(data: any): Promise<Product>;
  delete(id: number): void;
  find(limit: number, offset: number): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
  findStockByIds(ids: number[]): Promise<Product[]>;
}
