import { memoryDb } from "../../services/db.js";
import { encryptCredential } from "../../utils/crypto.js";
import { sandboxSupplierAdapter } from "../../integrations/suppliers/sandbox.adapter.js";
import { aliExpressSupplierAdapter } from "../../integrations/suppliers/aliexpress.adapter.js";
import { SupplierAdapter } from "../../integrations/suppliers/types.js";
import crypto from "crypto";

export class SuppliersService {
  private adapters: Record<string, SupplierAdapter> = {
    SANDBOX_MOCK: sandboxSupplierAdapter,
    ALIEXPRESS: aliExpressSupplierAdapter,
  };

  getAdapter(type: string): SupplierAdapter {
    const adapter = this.adapters[type];
    if (!adapter) {
      throw new Error(`Supplier adapter for type '${type}' is not configured.`);
    }
    return adapter;
  }

  async listAvailableSuppliers() {
    return memoryDb.suppliers;
  }

  async getStoreConnections(storeId: string) {
    const connections = memoryDb.supplierConnections.filter((sc) => sc.storeId === storeId);
    return connections.map((c) => {
      const supplier = memoryDb.suppliers.find((s) => s.id === c.supplierId);
      return {
        id: c.id,
        supplierId: c.supplierId,
        supplierName: supplier?.name,
        supplierType: supplier?.type,
        isActive: c.isActive,
        lastSyncedAt: c.lastSyncedAt,
        lastSyncError: c.lastSyncError,
        // Notice: encryptedCredentials are intentionally never leaked in public API response
      };
    });
  }

  async connectSupplier(storeId: string, supplierId: string, credentials: any) {
    const supplier = memoryDb.suppliers.find((s) => s.id === supplierId);
    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    const adapter = this.getAdapter(supplier.type);
    const isValid = await adapter.validateConnection(credentials);
    if (!isValid) {
      throw new Error("Failed to validate supplier credentials with external API.");
    }

    const encryptedCredentials = encryptCredential(JSON.stringify(credentials));

    let connection = memoryDb.supplierConnections.find(
      (c) => c.storeId === storeId && c.supplierId === supplierId
    );

    if (connection) {
      connection.encryptedCredentials = encryptedCredentials;
      connection.isActive = true;
      connection.lastSyncedAt = new Date().toISOString();
      connection.lastSyncError = null;
    } else {
      connection = {
        id: `sconn_${crypto.randomUUID().slice(0, 8)}`,
        storeId,
        supplierId,
        encryptedCredentials,
        isActive: true,
        lastSyncedAt: new Date().toISOString(),
        lastSyncError: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryDb.supplierConnections.push(connection);
    }

    return {
      id: connection.id,
      storeId: connection.storeId,
      supplierId: connection.supplierId,
      supplierName: supplier.name,
      isActive: connection.isActive,
    };
  }

  async searchSupplierProducts(supplierType: string, query: string) {
    const adapter = this.getAdapter(supplierType);
    return adapter.searchProducts(query);
  }

  async importSupplierProduct(storeId: string, supplierType: string, externalId: string, profitMarkup: number = 2.5) {
    const adapter = this.getAdapter(supplierType);
    const extProduct = await adapter.fetchProductDetails(externalId);

    const sellingPrice = Number((extProduct.price * profitMarkup).toFixed(2));
    const slug = extProduct.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newProduct = {
      id: `prod_${crypto.randomUUID().slice(0, 8)}`,
      storeId,
      title: extProduct.title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description: extProduct.description,
      price: sellingPrice,
      compareAtPrice: Number((sellingPrice * 1.3).toFixed(2)),
      supplierCost: extProduct.price,
      sku: `IMP-${externalId}`,
      inventoryCount: extProduct.stock,
      status: "ACTIVE" as const,
      images: extProduct.images,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryDb.products.push(newProduct);
    return newProduct;
  }
}

export const suppliersService = new SuppliersService();
