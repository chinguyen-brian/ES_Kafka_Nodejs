import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  serial,
  timestamp,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: integer("order_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  amount: numeric("amount").notNull(),
  status: varchar("status").notNull(),
  txnId: varchar("txn_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Order = InferSelectModel<typeof orders>;

export const orderLineItems = pgTable("order_line_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, {
    onDelete: "cascade",
  }),
  itemName: varchar("item_name").notNull(),
  qty: integer("qty").notNull(),
  price: numeric("amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type OrderLineItem = InferSelectModel<typeof orderLineItems>;

export const orderRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderLineItems),
}));

export const orderItemRelations = relations(orderLineItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderLineItems.orderId],
    references: [orders.id],
  }),
}));
