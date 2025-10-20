import type { ICatalogRepository } from "../interface/catalogRepository.interface.js";
import { Product } from "../models/product.model.js";

export class MockCatalogRepository implements ICatalogRepository {
  create(data: Product): Promise<Product> {
    const mockProduct = {
      id: 123,
      ...data,
    } as Product;
    return Promise.resolve(mockProduct);
  }
  update(data: any): Promise<Product> {
    return Promise.resolve(data as unknown as Product);
  }
  delete(id: number): Promise<number> {
    return Promise.resolve(id);
  }
  find(limit: number, offset: number): Promise<Product[]> {
    return Promise.resolve([]);
  }
  findOne(id: number): Promise<Product> {
    return Promise.resolve({} as unknown as Product);
  }
}
