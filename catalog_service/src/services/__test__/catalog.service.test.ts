import { ICatalogRepository } from "../../interface/catalogRepository.interface.js";
import { Product } from "../../models/product.model.js";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository.js";
import { CatalogService } from "../catalog.service.js";
import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { ProductFactory } from "../../utils/fixtures/index.js";

const mockProduct = (rest?: any): Product => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 1, max: 100 }),
    price: +faker.commerce.price(),
    ...rest,
  };
};

describe("catalogService", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new MockCatalogRepository();
  });

  afterEach(() => {
    repository = {} as MockCatalogRepository;
  });

  describe("createProduct", () => {
    test("should create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();
      const result = await service.createProduct(reqBody);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should throw error with unable to create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();
      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() => Promise.resolve({} as Product));
      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Unable to create product"
      );
    });

    test("should throw error with product already exist", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct();
      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product already exist"))
        );
      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Product already exist"
      );
    });
  });

  describe("updateProduct", () => {
    test("should update product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct({
        id: +faker.number.int({ min: 1, max: 1000 }),
      });
      const result = await service.updateProduct(reqBody);
      expect(result).toMatchObject(reqBody);
    });

    test("should throw error with product does not exist", async () => {
      const service = new CatalogService(repository);
      jest
        .spyOn(repository, "update")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product does not exist"))
        );
      await expect(service.updateProduct({} as Product)).rejects.toThrow(
        "Product does not exist"
      );
    });
  });

  describe("getProducts", () => {
    test("should get products by offset and limit", async () => {
      const service = new CatalogService(repository);
      const randomLimit = +faker.number.int({ min: 5, max: 30 });
      const products = ProductFactory.buildList(randomLimit);

      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() => Promise.resolve(products));

      const result = await service.getProducts(randomLimit, 0);

      expect(result.length).toEqual(randomLimit);
      expect(result).toMatchObject(products);
    });

    test("should throw error with products do not exist", async () => {
      const service = new CatalogService(repository);
      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Products do not exist"))
        );
      await expect(service.getProducts(0, 0)).rejects.toThrow(
        "Products do not exist"
      );
    });
  });

  describe("getProductById", () => {
    test("should get product by id", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();

      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() => Promise.resolve(product));

      const result = await service.getProductById(product.id!);

      expect(result).toMatchObject(product);
    });

    test("should throw error with product does not exist", async () => {
      const service = new CatalogService(repository);
      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product does not exist"))
        );
      await expect(service.getProductById(0)).rejects.toThrow(
        "Product does not exist"
      );
    });
  });

  describe("deleteProduct", () => {
    test("should delete product by id", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();

      jest
        .spyOn(repository, "delete")
        .mockImplementationOnce(() => Promise.resolve({ id: product.id }));

      const result = await service.deleteProduct(product.id!);

      expect(result).toMatchObject({
        id: product.id,
      });
    });

    test("should throw error with product does not exist", async () => {
      const service = new CatalogService(repository);
      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product does not exist"))
        );
      await expect(service.getProductById(0)).rejects.toThrow(
        "Product does not exist"
      );
    });
  });
});
