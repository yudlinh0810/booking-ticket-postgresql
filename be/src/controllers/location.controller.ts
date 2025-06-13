import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { LocationService } from "../services/location.service";
import { bookBusTicketsDB } from "../config/db";

export class LocationController {
  private locationService = new LocationService(bookBusTicketsDB);
  add = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.locationService.add(req.body.newValue);
      return successResponse(res, 200, response);
    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  };

  delete = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    if (!id) return errorResponse(res, "Id location null!.", 404);

    try {
      const response = await this.locationService.delete(id);
      return successResponse(res, 200, response);
    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  };

  getAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.locationService.getAll();
      if (response.status === "ERR") {
        return errorResponse(res, response.message, 404);
      }
      return successResponse(res, 200, response.data);
    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  };
}
