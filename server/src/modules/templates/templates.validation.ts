import { z } from "zod";

export const themeConfigSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Invalid primary hex color"),
    background: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Invalid background hex color"),
    foreground: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Invalid foreground hex color"),
    accent: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Invalid accent hex color"),
    muted: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Invalid muted hex color"),
  }),
  typography: z.object({
    fontFamily: z.string().min(1).max(100),
    headingFont: z.string().min(1).max(100),
  }),
  header: z.object({
    showAnnouncement: z.boolean().default(true),
    announcementText: z.string().max(200).optional(),
    logoUrl: z.string().url().or(z.literal("")).optional(),
    navigation: z.array(
      z.object({
        label: z.string().min(1).max(50),
        href: z.string().min(1).max(200),
      })
    ),
  }),
  hero: z.object({
    headline: z.string().min(1).max(150),
    subheadline: z.string().max(300),
    buttonText: z.string().min(1).max(50),
    buttonLink: z.string().min(1).max(200),
    backgroundImageUrl: z.string().url().or(z.literal("")).optional(),
  }),
  sections: z.object({
    showFeaturedProducts: z.boolean().default(true),
    showCategories: z.boolean().default(true),
    showPromotions: z.boolean().default(true),
    showNewsletter: z.boolean().default(true),
  }),
  footer: z.object({
    aboutText: z.string().max(500),
    links: z.array(
      z.object({
        label: z.string().min(1).max(50),
        href: z.string().min(1).max(200),
      })
    ),
    copyright: z.string().max(150),
  }),
});

export const updateThemeDraftSchema = z.object({
  templateId: z.string().optional(),
  config: themeConfigSchema,
});
