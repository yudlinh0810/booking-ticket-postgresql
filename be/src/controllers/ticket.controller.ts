import { Request, Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import { errorResponse, successResponse } from "../utils/response.util";
import TicketService from "../services/ticket.service";
import { ArrangeType } from "../@types/type";
import { PaymentStatus, PaymentType } from "../@types/payment";
import testPhone from "../utils/testPhone";

export class TicketController {
  private ticketService = new TicketService(bookBusTicketsDB);

  add = async (req: Request, res: Response): Promise<any> => {
    try {
      const formData = req.body;
      const result = await this.ticketService.add(formData);
      return successResponse(res, 200, result);
    } catch (error) {
      return errorResponse(res, "err add trip", 500);
    }
  };

  getDetailTicket = async (req: Request, res: Response): Promise<any> => {
    const { phone, idTicket } = req.body;
    try {
      const result = await this.ticketService.getDetailTicket({ phone, idTicket });
      return successResponse(res, 200, result);
    } catch (error) {
      return errorResponse(res, "ERR Controller.getDetailTicket", 404);
    }
  };

  getDetailTicketByEmail = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    try {
      const result = await this.ticketService.getDetailTicketByEmail(email);
      return successResponse(res, 200, result);
    } catch (error) {
      return errorResponse(res, "ERR Controller.getDetailTicket", 404);
    }
  };

  deleteById = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      if (!id) return errorResponse(res, "Id not invalid", 404);
      const response = await this.ticketService.deleteById(Number(id));
      if (response.status === "ERR") {
        return errorResponse(res, response.message);
      } else {
        return successResponse(res, 200, response);
      }
    } catch (error) {
      return errorResponse(res, "ERR Controller.getDetailTicket", 404);
    }
  };

  getAllTicket = async (req: Request, res: Response): Promise<any> => {
    try {
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset) || 0;
      const transactionId = (req.query.transaction as string) || "";
      const phone = (req.query.phone as string) || "";
      if (phone && testPhone(phone) === false) {
        return errorResponse(res, "Invalid phone number format", 400);
      }
      const paymentStatus = (req.query.payment_status as string)?.toLowerCase() || "";
      const paymentType = (req.query.payment_type as string)?.toLowerCase() || "";
      if (
        paymentStatus &&
        !["pending", "paid", "failed", "refunded"].includes(paymentStatus.toLowerCase())
      ) {
        return errorResponse(res, "Invalid payment status", 400);
      }
      const arrangeType =
        (req.query.arrange_type as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || offset < 0)
        return errorResponse(res, "limit and offset must be greater than 0", 404);

      const result = await this.ticketService.getAll(limit, offset, {
        arrangeType,
        transactionId,
        phone,
        paymentStatus: paymentStatus as PaymentStatus,
        paymentType: paymentType as PaymentType,
      });
      return successResponse(res, 200, result);
    } catch (error) {
      return errorResponse(res, "ERR Controller.getAll", 404);
    }
  };
}

export default new TicketController();
