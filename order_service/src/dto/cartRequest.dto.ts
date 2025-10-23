import { Static, Type } from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestInput = Static<typeof CartRequestSchema>;

export const CartEditRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type CartEditRequestInput = Static<typeof CartEditRequestSchema>;

type CartLineItem = {
  id: number;
  productId: number;
  itemName: string;
  variant: string | null;
  qty: number;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  availability?: number;
};

export interface CartWithLineItems {
  id: number;
  customerId: number;
  lineItems: CartLineItem[];
  createdAt: Date;
  updatedAt: Date;
}
