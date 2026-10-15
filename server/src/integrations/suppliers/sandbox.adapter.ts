import {
  SupplierAdapter,
  SupplierProductResult,
  SupplierOrderPayload,
  SupplierOrderResult,
  SupplierTrackingResult,
} from "./types.js";

export class SandboxSupplierAdapter implements SupplierAdapter {
  readonly code = "SANDBOX_MOCK";
  readonly name = "DropPilot Sandbox Mock Supplier";

  async validateConnection(credentials: any): Promise<boolean> {
    // Sandbox credentials always succeed if provided
    return Boolean(credentials);
  }

  async searchProducts(query: string): Promise<SupplierProductResult[]> {
    const mockFeed: SupplierProductResult[] = [
      {
        externalId: "SB-PROD-9001",
        title: "Magnetic Wireless Power Bank 10,000mAh",
        description: "Ultra-slim 15W fast wireless charging with strong neodymium magnets.",
        price: 18.5,
        currency: "USD",
        stock: 350,
        images: ["https://images.unsplash.com/photo-1609592424361-b44c68833924?w=800&q=80"],
        variants: [
          { externalVariantId: "SB-VAR-9001-BLK", title: "Space Grey", price: 18.5, stock: 200 },
          { externalVariantId: "SB-VAR-9001-WHT", title: "Pearl White", price: 18.5, stock: 150 },
        ],
      },
      {
        externalId: "SB-PROD-9002",
        title: "Ergonomic Memory Foam Wrist Rest",
        description: "Contoured cooling gel memory foam support for mechanical keyboards.",
        price: 6.2,
        currency: "USD",
        stock: 500,
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"],
      },
      {
        externalId: "SB-PROD-9003",
        title: "Minimalist Italian Leather Cardholder",
        description: "RFID-blocking ultra-thin slim bi-fold wallet for 8 cards and folded cash.",
        price: 11.0,
        currency: "USD",
        stock: 220,
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"],
      },
    ];

    if (!query) return mockFeed;
    const q = query.toLowerCase();
    return mockFeed.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  async fetchProductDetails(externalId: string): Promise<SupplierProductResult> {
    const products = await this.searchProducts("");
    const found = products.find((p) => p.externalId === externalId);
    if (!found) {
      throw new Error(`Sandbox product with externalId '${externalId}' not found.`);
    }
    return found;
  }

  async syncStockAndPrice(externalId: string): Promise<{ price: number; stock: number }> {
    const product = await this.fetchProductDetails(externalId);
    return {
      price: product.price,
      stock: product.stock,
    };
  }

  async createSupplierOrder(payload: SupplierOrderPayload): Promise<SupplierOrderResult> {
    const totalCost = payload.items.reduce((acc, item) => acc + 15.0 * item.quantity, 0);
    const mockExternalId = `SB-ORDER-${Date.now().toString().slice(-6)}`;

    return {
      externalOrderId: mockExternalId,
      status: "SUBMITTED",
      estimatedDeliveryDays: 7,
      supplierCostTotal: totalCost,
    };
  }

  async fetchShipmentTracking(externalOrderId: string): Promise<SupplierTrackingResult> {
    return {
      trackingNumber: `TRK-SB-${externalOrderId}`,
      carrier: "Sandbox Direct Express",
      trackingUrl: `https://track.droppilot.internal/shipments/TRK-SB-${externalOrderId}`,
      status: "IN_TRANSIT",
      updatedAt: new Date().toISOString(),
    };
  }
}

export const sandboxSupplierAdapter = new SandboxSupplierAdapter();
