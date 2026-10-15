import { memoryDb } from "../services/db.js";
import { sandboxSupplierAdapter } from "../integrations/suppliers/sandbox.adapter.js";
import crypto from "crypto";

export class FulfillmentWorker {
  /**
   * Processes fulfillment for a paid order
   */
  async fulfillOrder(orderId: string): Promise<any> {
    const order = memoryDb.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found.`);
    }

    if (order.status !== "PAID" && order.status !== "PROCESSING") {
      throw new Error(`Cannot fulfill order in '${order.status}' state.`);
    }

    order.status = "PROCESSING";

    // Lookup items
    const items = memoryDb.orderItems.filter((i) => i.orderId === order.id);

    // Call supplier adapter
    const supplierResult = await sandboxSupplierAdapter.createSupplierOrder({
      storeId: order.storeId,
      orderNumber: order.orderNumber,
      items: items.map((i) => ({
        externalProductId: i.sku || "PROD-GEN",
        quantity: i.quantity,
      })),
      shippingAddress: order.shippingAddress,
    });

    const trackingResult = await sandboxSupplierAdapter.fetchShipmentTracking(
      supplierResult.externalOrderId
    );

    let fulfillment = memoryDb.fulfillments.find((f) => f.orderId === order.id);
    if (!fulfillment) {
      fulfillment = {
        id: `ful_${crypto.randomUUID().slice(0, 8)}`,
        orderId: order.id,
        storeId: order.storeId,
        status: "IN_TRANSIT",
        externalOrderId: supplierResult.externalOrderId,
        trackingNumber: trackingResult.trackingNumber,
        carrier: trackingResult.carrier,
        trackingUrl: trackingResult.trackingUrl,
        retryCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryDb.fulfillments.push(fulfillment);
    } else {
      fulfillment.status = "IN_TRANSIT";
      fulfillment.externalOrderId = supplierResult.externalOrderId;
      fulfillment.trackingNumber = trackingResult.trackingNumber;
      fulfillment.carrier = trackingResult.carrier;
      fulfillment.trackingUrl = trackingResult.trackingUrl;
      fulfillment.updatedAt = new Date().toISOString();
    }

    order.status = "FULFILLED";
    order.updatedAt = new Date().toISOString();

    return fulfillment;
  }
}

export const fulfillmentWorker = new FulfillmentWorker();
