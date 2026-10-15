import { memoryDb } from "../../services/db.js";
import { fulfillmentWorker } from "../../jobs/fulfillment.worker.js";

export class OrdersService {
  async listStoreOrders(storeId: string) {
    const orders = memoryDb.orders.filter((o) => o.storeId === storeId);
    return orders.map((o) => {
      const items = memoryDb.orderItems.filter((i) => i.orderId === o.id);
      const fulfillment = memoryDb.fulfillments.find((f) => f.orderId === o.id);
      return {
        ...o,
        items,
        fulfillment,
      };
    });
  }

  async getOrderDetails(storeId: string, orderId: string) {
    const order = memoryDb.orders.find((o) => o.id === orderId && o.storeId === storeId);
    if (!order) {
      throw new Error("Order not found in this store.");
    }
    const items = memoryDb.orderItems.filter((i) => i.orderId === order.id);
    const fulfillment = memoryDb.fulfillments.find((f) => f.orderId === order.id);
    return {
      ...order,
      items,
      fulfillment,
    };
  }

  async triggerFulfillment(storeId: string, orderId: string) {
    const order = memoryDb.orders.find((o) => o.id === orderId && o.storeId === storeId);
    if (!order) {
      throw new Error("Order not found in this store.");
    }
    return fulfillmentWorker.fulfillOrder(order.id);
  }

  async updateOrderStatus(storeId: string, orderId: string, status: string) {
    const order = memoryDb.orders.find((o) => o.id === orderId && o.storeId === storeId);
    if (!order) {
      throw new Error("Order not found in this store.");
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}

export const ordersService = new OrdersService();
