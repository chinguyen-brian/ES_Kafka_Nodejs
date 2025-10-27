import { OrderWithLineItems } from "../dto/orderRequest.dto";
import { OrderStatus } from "../types";
import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import { orderLineItems, orders } from "../db/schema";

export type OrderRepositoryType = {
  createOrder: (lineItem: OrderWithLineItems) => Promise<number>;
  findOrder: (orderId: number) => Promise<OrderWithLineItems | null>;
  fineOrderByOrderNumber: (orderNumber: number) => Promise<OrderWithLineItems | null>;
  updateOrder: (
    orderId: number,
    status: OrderStatus
  ) => Promise<OrderWithLineItems>;
  deleteOrder: (id: number) => Promise<boolean>;
  findOrdersByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
};

const createOrder = async (lineItem: OrderWithLineItems): Promise<number> => {
  const result = await DB.insert(orders)
    .values({
      customerId: lineItem.customerId,
      orderNumber: lineItem.orderNumber,
      status: lineItem.status,
      txnId: lineItem.txnId,
      amount: lineItem.amount,
    })
    .returning();

  const [{ id }] = result;

  if (id > 0) {
    for (const item of lineItem.orderItems) {
      await DB.insert(orderLineItems)
        .values({
          orderId: id,
          itemName: item.itemName,
          price: item.price,
          qty: item.qty,
        })
        .execute();
    }
  }
  return id;
};
const findOrder = async (
  orderId: number
): Promise<OrderWithLineItems | null> => {
  const order = await DB.query.orders.findFirst({
    where: (orders) => eq(orders.id, orderId),
    with: {
      orderItems: true,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return order as unknown as OrderWithLineItems;
};

const fineOrderByOrderNumber = async (
  orderNumber: number
): Promise<OrderWithLineItems | null> => {
  const order = await DB.query.orders.findFirst({
    where: (orders) => eq(orders.orderNumber, orderNumber),
    with: {
      orderItems: true,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return order as unknown as OrderWithLineItems;
};

const updateOrder = async (
  orderId: number,
  status: string
): Promise<OrderWithLineItems> => {
  await DB.update(orders)
    .set({
      status: status,
    })
    .where(eq(orders.id, orderId))
    .execute();
  const order = await findOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const deleteOrder = async (orderId: number): Promise<boolean> => {
  await DB.delete(orders).where(eq(orders.id, orderId)).returning();
  return true;
};

const findOrdersByCustomerId = async (
  customerId: number
): Promise<OrderWithLineItems[]> => {
  const orders = await DB.query.orders.findMany({
    where: (orders) => eq(orders.customerId, customerId),
    with: {
      orderItems: true,
    },
  });
  return orders as unknown as OrderWithLineItems[];
};

export const OrderRepository: OrderRepositoryType = {
  createOrder,
  findOrder,
  fineOrderByOrderNumber,
  updateOrder,
  deleteOrder,
  findOrdersByCustomerId,
};
