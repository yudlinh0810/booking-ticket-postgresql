import { Request, Response } from "express";
import { WebhookService } from "../services/webhook.service";
import { errorResponse, successResponse } from "../utils/response.util";

const webhookService = new WebhookService();

export const handleWebhook = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("event", req.body);
    const { desc, success, data } = req.body;

    if (desc !== "success" || success !== true) {
      console.warn("Webhook không hợp lệ:", req.body);
      // return res.status(200).json({ message: "Webhook ignored" });
      return successResponse(res, 200, { message: "Webhook ignored" });
    }

    const response = await webhookService.processWebhookEvent(data.orderCode, data.reference);
    return successResponse(res, 200, response);
  } catch (error) {
    return errorResponse(res, "Internal Server Error", 500);
  }
};
