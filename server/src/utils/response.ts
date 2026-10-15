import { Response } from "express";

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 400, code: string = "BAD_REQUEST") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export function sendSuccess<T>(res: Response, data?: T, message?: string, statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  code: string = "BAD_REQUEST",
  details?: any
): void {
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
}
