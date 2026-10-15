import jwt from "jsonwebtoken";
import { Response } from "express";
import { config } from "../config/index.js";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "PLATFORM_ADMIN" | "USER";
}

const TOKEN_EXPIRY = "7d";
export const COOKIE_NAME = "droppilot_session";

const secret = config.JWT_SECRET || config.AUTH_SECRET;

export function signSessionToken(payload: TokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
}

export function verifySessionToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(res: Response, token: string): void {
  const isProduction = config.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  const isProduction = config.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
    path: "/",
  });
}
