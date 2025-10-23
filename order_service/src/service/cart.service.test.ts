import { CartRepositoryType } from "../repository/cart.repository";
import { CartRepository } from "../repository/cart.repository";
import { CreateCart } from "./cart.service";

describe("cartService", () => {
  let repo: CartRepositoryType;
  beforeEach(() => {
    repo = CartRepository;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  it("should return correct data while creating cart", async () => {
    const mockCart = {
      customerId: 1,
      productId: 1,
      qty: 1,
    };
    jest
      .spyOn(CartRepository, "createCart")
      .mockImplementationOnce(() => Promise.resolve(0));
    const res = await CreateCart(mockCart, repo);
    expect(res).toEqual({
      message: "fake response from cart repo",
      input: mockCart,
    });
  });
});
