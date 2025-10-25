import { OrderLineItemType, OrderWithLineItems } from "../dto/orderRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepositoryType } from "../repository/order.repository";
import { MessageType, OrderStatus } from "../types";

export const CreateOrder = async (
  userId: number,
  repo: OrderRepositoryType,
  cartRepo: CartRepositoryType
) => {
  // find cart by user id
  const cart = await cartRepo.findCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }
  // calculate total amount
  // create order items from cart items
  let totalAmount = 0;
  let orderLineItems: OrderLineItemType[] = [];
  cart.lineItems.forEach((cartItem) => {
    totalAmount += Number(cartItem.price) * cartItem.qty;
    orderLineItems.push({
      itemName: cartItem.itemName,
      qty: cartItem.qty,
      price: cartItem.price,
    } as OrderLineItemType);
  });

  const orderNumber = Math.floor(Math.random() * 900000);

  // create order record
  const orderInput: OrderWithLineItems = {
    customerId: userId,
    orderNumber: orderNumber,
    txnId: null,
    amount: totalAmount.toString(),
    status: OrderStatus.PENDING,
    orderItems: orderLineItems,
  } as OrderWithLineItems;

  const order = await repo.createOrder(orderInput);
  await cartRepo.clearCartData(cart.id);
  console.log("Order created", order);

  //TODO: send message to catalog service to update stock)
  // await repo.publishOrderEvent(order, "ORDER_CREATED");
  return { message: "Order created successfully", orderNumber: orderNumber };
};

export const UpdateOrder = async (
  orderId: number,
  status: OrderStatus,
  repo: OrderRepositoryType
) => {
  await repo.updateOrder(orderId, status);

  //TODO: send message to catalog service to update stock based on order status
  if (status === OrderStatus.CANCELLED) {
    // await repo.publishOrderEvent(order, "ORDER_CANCELLED");
  }
  return { message: "Order updated successfully" };
};

export const GetOrder = async (orderId: number, repo: OrderRepositoryType) => {
  const order = await repo.findOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

export const GetOrdersByCustomerId = async (
  userId: number,
  repo: OrderRepositoryType
) => {
  const orders = await repo.findOrdersByCustomerId(userId);
  if (!Array.isArray(orders)) {
    throw new Error("Orders not found");
  }
  return orders;
};

export const DeleteOrder = async (
  orderId: number,
  repo: OrderRepositoryType
) => {
  await repo.deleteOrder(orderId);
  return true;
};

export const HandleSubscription = async (message: MessageType) => {
  console.log("Message received by order Kafka consumer", message);
};
