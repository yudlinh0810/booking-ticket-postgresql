export class UserSocketStore {
  private userSocketMap: Map<string, string>; // userId -> socketId

  constructor() {
    this.userSocketMap = new Map();
  }

  getSocketIdByUserId(userId: string | number): string | undefined {
    return this.userSocketMap.get(userId.toString());
  }

  registerUserSocket(userId: string | number, socketId: string) {
    this.userSocketMap.set(userId.toString(), socketId);
    console.log(`[UserSocketStore] registered ${userId} -> ${socketId}`);
  }

  removeUserSocket(userId: string | number) {
    this.userSocketMap.delete(userId.toString());
    console.log(`[UserSocketStore] removed ${userId}`);
  }

  removeBySocketId(socketId: string) {
    for (const [userId, sId] of this.userSocketMap.entries()) {
      if (sId === socketId) {
        this.userSocketMap.delete(userId);
        console.log(`[UserSocketStore] removed ${userId} with socket ${socketId}`);
        return userId;
      }
    }
    return null;
  }

  clearAllSockets() {
    this.userSocketMap.clear();
    console.log("[UserSocketStore] cleared all sockets");
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSocketMap.keys());
  }

  hasUser(userId: string | number): boolean {
    return this.userSocketMap.has(userId.toString());
  }
}

// export 1 instance dùng chung toàn app
export const userSocketStore = new UserSocketStore();
