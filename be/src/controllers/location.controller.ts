import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response.util";
import { LocationService } from "../services/location.service";

export class LocationController {
  private locationService = new LocationService();
  add = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.locationService.add(req.body.newValue);
      return successResponse(res, 200, response);
    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  };
}
