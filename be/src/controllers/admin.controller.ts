import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { ArrangeType } from "../@types/type";
import { AdminService } from "../services/admin.service";

export class AdminController {
  private adminService = new AdminService();

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit) || 10;
      const arrangeType =
        (req.query.arrange_type as string)?.toUpperCase() === "ASC"
          ? "ASC"
          : ("DESC" as ArrangeType);

      if (limit < 0 || !page) return errorResponse(res, "limit must be greater than 0", 404);

      const data = await this.adminService.getAllPagination(page, limit, arrangeType);

      return successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.getAll", 500);
    }
  }

  async create(req: Request, res: Response): Promise<any> {
    try {
      const dataNewAdmin = req.body;

      if (!dataNewAdmin.email || !dataNewAdmin.password || !dataNewAdmin.full_name) {
        return errorResponse(res, "email, password and full_name are required", 400);
      }

      const data = await this.adminService.add(dataNewAdmin);

      return successResponse(res, 200, data);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.create", 500);
    }
  }

  async updateAdminDetails(req: Request, res: Response): Promise<any> {
    try {
      const id = req.user.id;
      const dataNewAdmin = req.body;

      if (Object.keys(dataNewAdmin).length === 0) {
        return errorResponse(res, "No data to update", 400);
      }

      const resultUpdateAdmin = await this.adminService.updateAdminDetails(id, dataNewAdmin);

      return successResponse(res, 200, resultUpdateAdmin);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.updateAdminDetails", 500);
    }
  }

  async updateAdminPassword(req: Request, res: Response): Promise<any> {
    try {
      const id = req.user.id;
      const { passwordOld, passwordNew } = req.body;
      if (!passwordOld || !passwordNew) {
        return errorResponse(res, "passwordOld and passwordNew are required", 400);
      }
      const resultUpdateAdmin = await this.adminService.updateAdminPassword(
        id,
        passwordOld,
        passwordNew
      );
      return successResponse(res, 204);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.updateAdminPassword", 500);
    }
  }

  async resetAdminPassword(req: Request, res: Response): Promise<any> {
    try {
      const email = req.body.email;

      if (!email) return errorResponse(res, "Email is required", 400);

      const resultResetPassword = await this.adminService.resetAdminPassword(email);

      if (!resultResetPassword) {
        return errorResponse(res, "Failed to reset password", 500);
      } else {
        return successResponse(res, 204);
      }
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.updateAdminPassword", 500);
    }
  }

  async confirmResetAdminPassword(req: Request, res: Response): Promise<any> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return errorResponse(res, "token and newPassword are required", 400);
      }
      const resultResetPassword = await this.adminService.confirmResetAdminPassword(
        token,
        newPassword
      );

      if (!resultResetPassword) {
        return errorResponse(res, "Failed to reset password", 500);
      }

      return successResponse(res, 204);
    } catch (error) {
      console.log("Err Controller", error);
      return errorResponse(res, "ERR Controller.updateAdminPassword", 500);
    }
  }
}
