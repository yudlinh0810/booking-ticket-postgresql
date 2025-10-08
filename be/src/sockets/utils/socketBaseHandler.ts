import { Server, Socket } from "socket.io";
import { userSocketStore } from "../userSocketStore";

export const handleBaseEvents = (socket: Socket, namespaceName: string) => {
  console.log(`[${namespaceName}] ${socket.id} connected`);

  socket.on("disconnect", () => {
    const userId = userSocketStore.removeBySocketId(socket.id);
    if (userId) {
      console.log(`[${namespaceName}] ${userId} ${socket.id} disconnected`);
    }
  });

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
