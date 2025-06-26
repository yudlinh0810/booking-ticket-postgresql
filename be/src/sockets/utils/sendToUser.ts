import { Server } from "socket.io";
import { getSocketIdByUserId } from "../userSocketStore";

let io: Server;

export const initSocketInstance = (server: Server) => {
  io = server;
};

export const sendToUser = (
  namespace: string = "/",
  userId: string | number,
  event: string,
  payload: any
) => {
  const userIdStr = userId.toString();
  const socketId = getSocketIdByUserId(userIdStr);

  if (socketId && io) {
    io.of(namespace).to(socketId).emit(event, payload);
    return true;
  } else {
    console.log(`User ${userIdStr} not found or not connected`);
    return false;
  }
};
