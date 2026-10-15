import { memoryDb } from "../../services/db.js";
import { hashPassword, comparePassword } from "../../utils/crypto.js";
import { signSessionToken } from "../../utils/jwt.js";
import { AppError } from "../../utils/response.js";
import crypto from "crypto";

export class AuthService {
  async register(data: { email: string; password: string; name: string }) {
    const existing = memoryDb.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const passwordHash = await hashPassword(data.password);
    const newUser = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: "USER" as const,
      emailVerified: true, // Auto-verified for demo convenience
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryDb.users.push(newUser);

    // Default to Starter plan trial
    const starterPlan = memoryDb.plans.find((p) => p.code === "STARTER");
    if (starterPlan) {
      memoryDb.subscriptions.push({
        id: `sub_${crypto.randomUUID().slice(0, 8)}`,
        userId: newUser.id,
        planId: starterPlan.id,
        status: "TRIALING",
        provider: "RAZORPAY",
        providerSubscriptionId: `sub_trial_${crypto.randomUUID().slice(0, 8)}`,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 14 * 86400000).toISOString(),
        cancelAtPeriodEnd: false,
      });
    }

    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
      },
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = memoryDb.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (!user) {
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = memoryDb.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const memberships = memoryDb.memberships.filter((m) => m.userId === userId);
    const storeIds = memberships.map((m) => m.storeId);
    const stores = memoryDb.stores.filter((s) => storeIds.includes(s.id));

    const subscription = memoryDb.subscriptions.find((s) => s.userId === userId && s.status !== "EXPIRED");
    const plan = subscription ? memoryDb.plans.find((p) => p.id === subscription.planId) : null;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      stores,
      memberships,
      subscription: subscription ? { ...subscription, plan } : null,
    };
  }
}

export const authService = new AuthService();
