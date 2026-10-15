export interface SupplierProductResult {
  externalId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  variants?: Array<{
    externalVariantId: string;
    title: string;
    price: number;
    stock: number;
  }>;
}

export interface SupplierOrderPayload {
  storeId: string;
  orderNumber: string;
  items: Array<{
    externalProductId: string;
    externalVariantId?: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
}

export interface SupplierOrderResult {
  externalOrderId: string;
  status: "SUBMITTED" | "PROCESSING" | "SHIPPED" | "FAILED";
  estimatedDeliveryDays: number;
  supplierCostTotal: number;
}

export interface SupplierTrackingResult {
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  status: "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "EXCEPTION";
  updatedAt: string;
}

export interface SupplierAdapter {
  readonly code: string;
  readonly name: string;
  validateConnection(credentials: any): Promise<boolean>;
  searchProducts(query: string): Promise<SupplierProductResult[]>;
  fetchProductDetails(externalId: string): Promise<SupplierProductResult>;
  syncStockAndPrice(externalId: string): Promise<{ price: number; stock: number }>;
  createSupplierOrder(payload: SupplierOrderPayload): Promise<SupplierOrderResult>;
  fetchShipmentTracking(externalOrderId: string): Promise<SupplierTrackingResult>;
}
