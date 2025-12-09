import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { ArrangeType } from "../@types/type";
import { bookBusTicketsDB } from "../config/db";
import { AdminService } from "../services/admin.service";

export class AdminController {
  private adminService = new AdminService();

  getAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const lastId = Number(req.query.last_id);
      const limit = Number(req.query.limit) || 10;
      const arrangeType =
        (req.query.arrange_type as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || !lastId) return errorResponse(res, "limit must be greater than 0", 404);

      const data = await this.adminService.getAllCursor(lastId, limit, arrangeType);
      return successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.getAll", 404);
    }
  };

  create = async (req: Request, res: Response): Promise<any> => {
    try {
      const dataNewAdmin = req.body;
      const data = await this.adminService.add(dataNewAdmin);
      return successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.create", 404);
    }
  };
}
