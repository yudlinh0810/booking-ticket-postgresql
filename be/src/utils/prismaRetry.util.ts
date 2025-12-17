// src/utils/retry.ts (hoặc file chứa hàm này)
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

export async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      const isConnectionError =
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          (error.code === "P1001" || // Can't reach database server
            error.code === "P1002" || // Database server timeout
            error.code === "P1017")) || // Connection closed
        error.message?.includes("closed the connection");

      if (isConnectionError && attempt < maxRetries - 1) {
        console.warn(
          `Database connection error (Attempt ${attempt + 1}/${maxRetries}). Retrying in ${
            1000 * (attempt + 1)
          }ms...`
        );

        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));

        continue;
      }

      // Nếu là lần cuối hoặc không phải lỗi kết nối, ném lỗi ra
      if (attempt === maxRetries - 1) {
        console.error(`Max retries exceeded for DB operation. Last error:`, error.message);
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}
