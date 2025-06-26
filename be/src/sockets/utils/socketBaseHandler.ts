import { Server, Socket } from "socket.io";
import { userSocketMap } from "../userSocketStore";

export const handleBaseEvents = (socket: Socket, namespaceName: string) => {
  console.log(`[${namespaceName}] ${socket.id} connected`);
  socket.on("disconnect", () => {
    for (const [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        console.log(`[${namespaceName}] ${userId} ${socket.id} disconnected`);
        userSocketMap.delete(userId);
        break;
      }
    }
  });
  socket.on("disconnect", () => {});

  socket.on("error", (err) => {
    console.error(`[${namespaceName}] Error:`, err);
  });
};

export const applyBaseSocketEvents = (
  io: Server,
  namespace: string,
  onConnected: (socket: Socket) => void
) => {
  const nsp = io.of(namespace);
  nsp.on("connection", (socket: Socket) => {
    handleBaseEvents(socket, namespace);
    onConnected(socket);
  });
};
