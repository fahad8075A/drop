import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting DropPilot PostgreSQL database seed...");

  const adminPassword = await bcrypt.hash("AdminPass123!", 10);
  const ownerPassword = await bcrypt.hash("OwnerPass123!", 10);

  // 1. Seed Admin & Owners
  const admin = await prisma.user.upsert({
    where: { email: "admin@droppilot.com" },
    update: {},
    create: {
      email: "admin@droppilot.com",
      passwordHash: adminPassword,
      name: "Platform Administrator",
      role: "PLATFORM_ADMIN",
      emailVerified: true,
    },
  });

  const ownerAlex = await prisma.user.upsert({
    where: { email: "alex@droppilot.com" },
    update: {},
    create: {
      email: "alex@droppilot.com",
      passwordHash: ownerPassword,
      name: "Alex Vance",
      role: "USER",
      emailVerified: true,
    },
  });

  const ownerSarah = await prisma.user.upsert({
    where: { email: "sarah@droppilot.com" },
    update: {},
    create: {
      email: "sarah@droppilot.com",
      passwordHash: ownerPassword,
      name: "Sarah Connor",
      role: "USER",
      emailVerified: true,
    },
  });

  // 2. Seed Plans
  const starterPlan = await prisma.plan.upsert({
    where: { code: "STARTER" },
    update: {},
    create: {
      code: "STARTER",
      name: "Starter Launch",
      description: "Ideal for new merchants launching an initial brand.",
      monthlyPrice: 29.0,
      yearlyPrice: 290.0,
      currency: "USD",
      maxStores: 1,
      maxProducts: 50,
      customDomains: false,
      supplierSync: true,
      maxTeamMembers: 1,
      analyticsEnabled: false,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { code: "PRO" },
    update: {},
    create: {
      code: "PRO",
      name: "Scale & Growth",
      description: "For serious dropshippers managing multiple brands with automation.",
      monthlyPrice: 79.0,
      yearlyPrice: 790.0,
      currency: "USD",
      maxStores: 5,
      maxProducts: 500,
      customDomains: true,
      supplierSync: true,
      maxTeamMembers: 5,
      analyticsEnabled: true,
    },
  });

  // 3. Seed Templates
  const minimalTmpl = await prisma.template.upsert({
    where: { code: "minimal-modern" },
    update: {},
    create: {
      code: "minimal-modern",
      name: "Minimal Modern",
      description: "Curated aesthetic, generous whitespace, refined typography.",
      previewUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      version: "1.0.0",
      isDefault: true,
    },
  });

  const fashionTmpl = await prisma.template.upsert({
    where: { code: "fashion-lifestyle" },
    update: {},
    create: {
      code: "fashion-lifestyle",
      name: "Fashion & Lifestyle",
      description: "Bold editorial visuals, dynamic promotional banners.",
      previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      version: "1.0.0",
    },
  });

  const gadgetsTmpl = await prisma.template.upsert({
    where: { code: "electronics-gadgets" },
    update: {},
    create: {
      code: "electronics-gadgets",
      name: "Electronics & Gadgets",
      description: "High-contrast dark-mode highlights, technical specifications.",
      previewUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      version: "1.0.0",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
