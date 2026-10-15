# DropPilot Setup & Quickstart Guide

## Prerequisites
- Node.js >= 18.x (v20+ recommended)
- npm >= 9.x
- PostgreSQL database (or configured connection string)
- Redis instance (optional for local mock runner)

---

## 1. Installation

Clone or enter the project root directory:
```bash
cd c:\Users\fahad\Desktop\dropshipping
```

Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd ../client
npm install
```

---

## 2. Environment Configuration

### Server Configuration (`server/.env`)
Copy `.env.example` to `.env`:
```bash
cp server/.env.example server/.env
```
Ensure `DATABASE_URL`, `AUTH_SECRET`, and `ENCRYPTION_KEY` are configured.

### Client Configuration (`client/.env.local`)
Copy `.env.example` to `.env.local`:
```bash
cp client/.env.example client/.env.local
```
Ensure `NEXT_PUBLIC_API_URL` points to the Express API (default: `http://localhost:5000/api/v1`).

---

## 3. Database Initialization & Seeding

Run Prisma schema generation and seeds from the server directory:
```bash
cd server
npm run prisma:generate
npm run prisma:seed
```

The seed script creates:
- Platform Admin user: `admin@droppilot.com` / `AdminPass123!`
- Demo Store Owner: `alex@droppilot.com` / `OwnerPass123!`
- 3 Pre-configured Storefront Templates (Minimal Modern, Fashion & Lifestyle, Electronics & Gadgets)
- 3 Subscription Plans (Starter, Growth / Pro, Enterprise)
- 2 Demo stores with products, variants, supplier mappings, and sample orders

---

## 4. Running the Development Servers

Open two separate terminal windows:

### Terminal 1 - Backend Server:
```powershell
cd server
npm run dev
```
Express REST API runs at: `http://localhost:5000`

### Terminal 2 - Frontend Client:
```powershell
cd client
npm run dev
```
Next.js Application runs at: `http://localhost:3000`

---

## 5. Running Automated Tests

Run backend tests (unit, integration, cross-tenant security):
```bash
cd server
npm run test
```
