import { Server } from "socket.io";
import { applyBaseSocketEvents } from "../utils/socketBaseHandler";

export const createMessageNamespace = (io: Server) => {
  applyBaseSocketEvents(io, "/message", (socket) => {});
};
