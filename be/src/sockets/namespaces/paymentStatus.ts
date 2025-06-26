import { Server } from "socket.io";
import { applyBaseSocketEvents } from "../utils/socketBaseHandler";
import { registerUserSocket } from "../userSocketStore";

export const createPaymentStatusNamespace = (io: Server) => {
  applyBaseSocketEvents(io, "/payment", (socket) => {
    socket.on("register_user", (userId: number) => {
      if (!userId) {
        socket.emit("custom_error", "userId không hợp lệ");
        return;
      }
      const userIdStr = userId.toString();
      registerUserSocket(userIdStr, socket.id);

      socket.emit("user_registered", {
        userId: userIdStr,
        socketId: socket.id,
        message: "User registered successfully",
      });
    });
  });
};
