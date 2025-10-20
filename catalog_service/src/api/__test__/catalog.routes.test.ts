import { faker } from "@faker-js/faker";
import { Product } from "../../models/product.model.js";
import request from "supertest";
import { jest } from "@jest/globals";
import type { Express } from "express";
jest.useFakeTimers();

const mockRequest = (): Product => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 1, max: 100 }),
    price: +faker.commerce.price(),
  };
};

describe("catalogService", () => {
  let app: Express;
  beforeAll(async () => {
    const mod = await import("../../expressApp.js");
    app = mod.default;
  });
  describe("POST /products", () => {
    test("should create product successfully", async () => {
      const requestBody = mockRequest();
      //   const response = { status: 201, body: { ok: true, ...requestBody } };
      const response = await request(app)
        .post("/products")
        .send(requestBody)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(requestBody.name);
    });
  });
});
