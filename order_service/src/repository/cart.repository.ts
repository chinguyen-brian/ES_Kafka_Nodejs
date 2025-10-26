import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import { CartLineItem, cartLineItems, carts } from "../db/schema";
import { NotFoundError } from "../utils";
import { CartWithLineItems } from "../dto/cartRequest.dto";

// declare repository type
export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (id: number) => Promise<CartWithLineItems>;
  findCartByProductId: (
    customerId: number,
    productId: number
  ) => Promise<CartLineItem>;
  updateCart: (id: number, qty: number) => Promise<CartLineItem>;
  deleteCart: (id: number) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
};

const createCart = async (
  customerId: number,
  { itemName, price, productId, qty, variant }: CartLineItem
): Promise<number> => {
  const result = await DB.insert(carts)
    .values({ customerId: customerId })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;

  if (id > 0) {
    await DB.insert(cartLineItems).values({
      cartId: id,
      productId,
      itemName,
      price,
      qty,
      variant,
    });
  }
  return id;
};

const findCart = async (id: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: eq(carts.customerId, id),
    with: { lineItems: true },
  });

  if (!cart) {
    throw new NotFoundError("cart not found");
  }
  return cart;
};

const findCartByProductId = async (
  customerId: number,
  productId: number
): Promise<CartLineItem> => {
  const cart = await DB.query.carts.findFirst({
    where: eq(carts.customerId, customerId),
    with: {
      lineItems: true,
    },
  });
  const lineItem = cart?.lineItems.find((item) => item.productId === productId);

  return lineItem as CartLineItem;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({ qty })
    .where(eq(cartLineItems.id, id))
    .returning();
  return cartLineItem;
};

const deleteCart = async (id: number): Promise<Boolean> => {
  await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();
  return true;
};

const clearCartData = async (id: number): Promise<Boolean> => {
  await DB.delete(carts).where(eq(carts.customerId, id)).returning();
  return true;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  clearCartData,
  findCartByProductId,
};
