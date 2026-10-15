import { memoryDb } from "../../services/db.js";
import crypto from "crypto";

export class TemplatesService {
  async listTemplates() {
    return memoryDb.templates;
  }

  async getStoreTheme(storeId: string) {
    const draft = memoryDb.themeConfigs.find((tc) => tc.storeId === storeId && !tc.isPublished);
    const published = memoryDb.themeConfigs.find((tc) => tc.storeId === storeId && tc.isPublished);
    const store = memoryDb.stores.find((s) => s.id === storeId);
    const currentTemplate = memoryDb.templates.find((t) => t.id === store?.templateId);

    return {
      template: currentTemplate,
      draft: draft?.config || published?.config,
      published: published?.config,
      version: draft?.version || 1,
    };
  }

  async saveDraft(storeId: string, data: { templateId?: string; config: any }) {
    let draft = memoryDb.themeConfigs.find((tc) => tc.storeId === storeId && !tc.isPublished);
    const store = memoryDb.stores.find((s) => s.id === storeId);

    if (data.templateId && store) {
      store.templateId = data.templateId;
    }

    if (!draft) {
      draft = {
        id: `thm_${crypto.randomUUID().slice(0, 8)}`,
        storeId,
        templateId: store?.templateId || memoryDb.templates[0].id,
        version: 1,
        isPublished: false,
        config: data.config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryDb.themeConfigs.push(draft);
    } else {
      draft.config = data.config;
      if (data.templateId) draft.templateId = data.templateId;
      draft.updatedAt = new Date().toISOString();
    }

    return draft;
  }

  async publishTheme(storeId: string) {
    const draft = memoryDb.themeConfigs.find((tc) => tc.storeId === storeId && !tc.isPublished);
    if (!draft) {
      throw new Error("No draft theme configuration found to publish.");
    }

    let published = memoryDb.themeConfigs.find((tc) => tc.storeId === storeId && tc.isPublished);
    if (!published) {
      published = {
        id: `thm_${crypto.randomUUID().slice(0, 8)}`,
        storeId,
        templateId: draft.templateId,
        version: 1,
        isPublished: true,
        config: JSON.parse(JSON.stringify(draft.config)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryDb.themeConfigs.push(published);
    } else {
      published.config = JSON.parse(JSON.stringify(draft.config));
      published.templateId = draft.templateId;
      published.version += 1;
      published.updatedAt = new Date().toISOString();
    }

    // Record audit log
    memoryDb.auditLogs.push({
      id: `aud_${crypto.randomUUID().slice(0, 8)}`,
      storeId,
      action: "THEME_PUBLISHED",
      metadata: { version: published.version, templateId: published.templateId },
      createdAt: new Date().toISOString(),
    });

    return published;
  }
}

export const templatesService = new TemplatesService();
