import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import payosService from "../services/payos.service";

class PayOSController {
  async createPayment(req: Request, res: Response): Promise<any> {
    try {
      const body = req.body;
      const { amount, orderCode, returnUrl, cancelUrl } = body;
      if (!amount || !orderCode || !returnUrl || !cancelUrl) {
        return errorResponse(res, "Thiếu thông tin.", 401);
      }

      const response = await payosService.createPayment(body);
      return successResponse(res, 200, response);
    } catch (error) {
      console.log("err", error);
      return errorResponse(res, "Lỗi hệ thống", 500);
    }
  }

  async getPaymentLink(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: "Thiếu thông tin giao dịch." });
      }

      const response = await payosService.getPaymentLink(id);
      return successResponse(res, 200, response);
    } catch (error) {
      return errorResponse(res, "Lỗi hệ thống", 500);
    }
  }

  async cancelPayment(req: Request, res: Response): Promise<any> {
    try {
      const { id, reason } = req.body;
      if (!id || !reason) {
        res.status(400).json({ message: "Thiếu thông tin." });
      }

      const response = await payosService.cancelPaymentLink(id, reason);
      if (response.status === "ERR") {
        return errorResponse(res, response.message, 404);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      return errorResponse(res, "Lỗi hệ thống", 500);
    }
  }
}

export default new PayOSController();
