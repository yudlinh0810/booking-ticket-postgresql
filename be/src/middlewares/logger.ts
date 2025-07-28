import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

type RequestWithTraceId = Request & { traceId?: string };

export function logger(req: Request, res: Response, next: NextFunction): void {
  const tradeId = randomUUID();
  const start = Date.now();
  const { method, originalUrl } = req;
  const { statusCode } = res;

  (req as RequestWithTraceId).traceId = tradeId;

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(`[${tradeId}] ${method} ${originalUrl} ${statusCode} - ${durationMs}ms`);
  });
  next();
}
