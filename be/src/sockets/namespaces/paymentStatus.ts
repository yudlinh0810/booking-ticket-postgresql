import { Server } from "socket.io";
import { applyBaseSocketEvents } from "../utils/socketBaseHandler";
import { userSocketStore } from "../userSocketStore";

export const createPaymentStatusNamespace = (io: Server) => {
  applyBaseSocketEvents(io, "/payment", (socket) => {
    socket.on("register_user", (userId: number) => {
      const user = socket.handshake.headers.cookie;
      console.log("user", user);
      if (!userId) {
        socket.emit("custom_error", "userId không hợp lệ");
        return;
      }

      const userIdStr = userId.toString();
      userSocketStore.registerUserSocket(userIdStr, socket.id);

      socket.emit("user_registered", {
        userId: userIdStr,
        socketId: socket.id,
        message: "User registered successfully",
      });
    });
  });
};
