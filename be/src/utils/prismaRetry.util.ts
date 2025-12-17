import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

export async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} - Reconnecting...`);
      }

      return await operation();
    } catch (error: any) {
      const isConnectionError =
        error instanceof Prisma.PrismaClientInitializationError ||
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          (error.code === "P1001" || // Can't reach db
            error.code === "P1017")) || // Connection closed
        error.message?.includes("closed the connection");

      if (isConnectionError && attempt < maxRetries - 1) {
        console.warn(`Database connection dead. Refreshing pool... (Attempt ${attempt + 1})`);

        try {
          await prisma.$disconnect();
        } catch (e) {
          // Ignore lỗi khi disconnect
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }

      // Nếu hết lượt retry hoặc lỗi khác
      if (attempt === maxRetries - 1) {
        console.error(`Max retries exceeded. Last error:`, error.message);
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}
