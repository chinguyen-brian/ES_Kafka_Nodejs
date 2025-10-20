import type { ICatalogRepository } from "../interface/catalogRepository.interface.js";
import type { Product } from "../models/product.model.js";
import { PrismaClient } from "@prisma/client";

export class CatalogRepository implements ICatalogRepository {
  _prisma: PrismaClient;
  constructor() {
    this._prisma = new PrismaClient();
  }

  async create(data: Product): Promise<Product> {
    return this._prisma.product.create({
      data,
    });
  }
  async update(data: any): Promise<Product> {
    return this._prisma.product.update({
      where: { id: data.id },
      data,
    });
  }
  async delete(id: number) {
    return this._prisma.product.delete({
      where: { id },
    });
  }
  async find(limit: number, offset: number): Promise<Product[]> {
    return this._prisma.product.findMany({
      take: limit,
      skip: offset,
    });
  }
  async findOne(id: number): Promise<Product> {
    const product = await this._prisma.product.findFirst({
      where: { id },
    });
    if (product) {
      return Promise.resolve(product);
    }

    throw new Error("Product not found");
  }
}
