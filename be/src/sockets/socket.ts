import { Server } from "socket.io";
import { createChatboxNamespace } from "./namespaces/chatboxAI";
import { createMessageNamespace } from "./namespaces/message";
import { createPaymentStatusNamespace } from "./namespaces/paymentStatus";
import dotenv from "dotenv";
import { initSocketInstance } from "./utils/sendToUser";
dotenv.config();

export const setupSocketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", process.env.URL_FRONTEND_CLIENT],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  initSocketInstance(io);

  createChatboxNamespace(io);
  createMessageNamespace(io);
  createPaymentStatusNamespace(io);
};
