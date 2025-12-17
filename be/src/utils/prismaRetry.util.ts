import prisma from "@/config/prisma";

export async function executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Reconnecting to database (attempt ${attempt + 1}/${maxRetries})`);
        await prisma.$connect();
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
      return await operation();
    } catch (error: any) {
      const isConnectionError =
        error.code === "P1001" || // Can't reach database server
        error.code === "P1002" || // Database server timeout
        error.code === "P1017" || // Connection closed
        error.message?.includes("closed the connection") ||
        error.name === "PrismaClientInitializationError";

      if (isConnectionError && attempt < maxRetries - 1) {
        console.log(`Connection error, retrying (${attempt + 1}/${maxRetries})`);
        await prisma.$disconnect();
        continue;
      }

      // Log error chi tiết nếu hết retry
      if (attempt === maxRetries - 1) {
        console.error(`Max retries exceeded:`, error);
      }

      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}
