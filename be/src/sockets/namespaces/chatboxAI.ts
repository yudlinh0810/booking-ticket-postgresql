import { Server } from "socket.io";
import { applyBaseSocketEvents } from "../utils/socketBaseHandler";

import { TripData } from "../../@types/trip";
import { processQuestion } from "../../chatGPT/handleChatGPTForChatbox";
import { userSocketStore } from "../userSocketStore";
import { sendToUser } from "../utils/sendToUser";

interface QuestionData {
  userId: string;
  question: string;
  timestamp?: number;
}

interface ResponseData {
  questionId?: string;
  answer: string;
  timestamp: number;
  trips: TripData[];
  status: "success" | "error";
}

export const createChatboxNamespace = (io: Server) => {
  applyBaseSocketEvents(io, "/chatbox-ai", (socket) => {
    socket.on("register_user", (userId: number) => {
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

    socket.on("user_question", async (data: QuestionData) => {
      try {
        const { userId, question } = data;

        if (!userId || !question) {
          socket.emit("question_error", {
            message: "UserId và question không được để trống",
            timestamp: Date.now(),
          });
          return;
        }

        // Xử lý câu hỏi và lấy cả answer và filtered trips
        const result = await processQuestion(question, userId);
        const response: ResponseData = {
          answer: result.answer,
          trips: result.filteredTrips,
          timestamp: Date.now(),
          status: "success",
        };

        sendToUser("/chatbox-ai", userId, "question_response", response);

        socket.emit("question_received", {
          message: "Câu hỏi đã được xử lý thành công",
          questionId: `q_${Date.now()}`,
          timestamp: Date.now(),
        });
      } catch (error) {
        socket.emit("question_error", {
          message: "Có lỗi xảy ra khi xử lý câu hỏi",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: Date.now(),
        });
      }
    });
  });
};
