import { customerService } from "@/services";
import { errorResponse, successResponse } from "@/utils/response.util";
import { Response, Request } from "express";

export class CustomerController {
  public getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.user?.id;
      if (!id) return errorResponse(res, "Unauthorized", 401);

      const result = await customerService.getProfile(id);

      if (result.status === "ERR") {
        return errorResponse(res, result.message, 404);
      } else {
        return successResponse(res, 200, result.data);
      }
    } catch (error) {
      console.log("err", error);
      return errorResponse(res, "ERR Controller.getProfile", 500);
    }
  };
}
