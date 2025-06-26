export const userSocketMap = new Map<string, string>();

export const getSocketIdByUserId = (userId: string | number): string | undefined => {
  return userSocketMap.get(userId.toString());
};

export const registerUserSocket = (userId: string | number, socketId: string) => {
  userSocketMap.set(userId.toString(), socketId);
};

export const removeUserSocket = (userId: string | number) => {
  userSocketMap.delete(userId.toString());
};

export const clearAllSockets = () => {
  userSocketMap.clear();
};
