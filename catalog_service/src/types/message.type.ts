export type OrderLineItemType = {
  id: number;
  productId: number;
  qty: number;
  price: string;
};

export interface OrderWithLineItems {
  id: number;
  orderNumber: number;
  orderItems: OrderLineItemType[];
}
