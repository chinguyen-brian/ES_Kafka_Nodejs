import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  // get product details from catalog service
  const product = await GetProductDetails(input.productId);
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("Product is out of stock");
  }

  // find if the product already exists in cart
  const lineItem = await repo.findCartByProductId(
    input.customerId,
    input.productId
  );
  if (lineItem) {
    return repo.updateCart(lineItem.id, lineItem.qty + input.qty);
  }

  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price.toString(),
    qty: input.qty,
    itemName: product.name,
    variant: product.variant,
  } as CartLineItem);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  // get customer cart data
  const cart = await repo.findCart(id);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  // list all line items in the cart
  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("cart items not found");
  }

  // verify with inventory service for stock availability
  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId)
  );

  if (Array.isArray(stockDetails) && stockDetails.length) {
    // update stock availability in cart line items
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find(
        (prod) => prod.id === lineItem.productId
      );
      if (stockItem) {
        lineItem.availability = stockItem.stock;
      }
    });

    // update cart line items
    cart.lineItems = lineItems;
  }
  return cart;
};

const AuthorisedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.findCart(customerId);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizeError("you are not authorised to edit this cart");
  }
  return lineItem;
};

export const EditCart = async (
  input: CartEditRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorisedCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorisedCart(input.id, input.customerId, repo);
  const data = await repo.deleteCart(input.id);
  return data;
};
