import { Request, Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import { UserService } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { verifyRefreshToken } from "../services/auth.service";
import testEmail from "../utils/testEmail";

export class UserController {
  private userService = new UserService(bookBusTicketsDB);

  loginByAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        return errorResponse(res, "The input is required", 404);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 404);
      }

      const response = await this.userService.loginByAdmin(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { status, data, access_token, refresh_token, expirationTime } = response;
        res.cookie("access_token", access_token, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return successResponse(res, 200, { status, data, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          return errorResponse(res, response.message, 400);
        } else {
          return errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      return errorResponse(res, "Controller.login err", 500);
    }
  };

  loginByCustomer = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        return errorResponse(res, "The input is required", 404);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 404);
      }

      const response = await this.userService.loginByCustomer(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, data, refresh_token, status, expirationTime } = response;

        res.cookie("access_token", access_token, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return successResponse(res, 200, { status, data, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          return errorResponse(res, response.message, 200);
        } else {
          return errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      return errorResponse(res, "Controller.login err", 500);
    }
  };

  loginByDriver = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        return errorResponse(res, "The input is required", 404);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 404);
      }

      const response = await this.userService.loginByDriver(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, refresh_token, status, expirationTime } = response;
        res.cookie("access_token", access_token, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return successResponse(res, 200, { status, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          return errorResponse(res, response.message, 400);
        } else {
          return errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      return errorResponse(res, "Controller.login err", 500);
    }
  };

  loginByCoDriver = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      const isCheckEmail = testEmail(email);

      if (!email || !password) {
        return errorResponse(res, "The input is required", 404);
      }

      if (!isCheckEmail) {
        return errorResponse(res, "Email is not in correct format", 404);
      }

      const response = await this.userService.loginByCoDriver(req.body);

      if (
        "access_token" in response &&
        "refresh_token" in response &&
        "expirationTime" in response
      ) {
        const { access_token, refresh_token, status, expirationTime } = response;
        res.cookie("access_token", access_token, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return successResponse(res, 200, { status, expirationTime: expirationTime });
      } else {
        if ("message" in response) {
          return errorResponse(res, response.message, 400);
        } else {
          return errorResponse(res, "Unexpected error occurred", 400);
        }
      }
    } catch (err) {
      return errorResponse(res, "Controller.login err", 500);
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) return errorResponse(res, "Refresh token is required", 400);

      const response = await verifyRefreshToken(refreshToken);

      if ("access_token" in response && "expirationTime" in response) {
        const { access_token, expirationTime } = response;

        res.cookie("access_token", access_token, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
          path: "/",
        });
        return successResponse(res, 200, { expirationTime: expirationTime });
      } else {
        return errorResponse(res, response.message, 400);
      }
    } catch (error) {
      return errorResponse(res, "ERR Controller.refreshToken", 500);
    }
  };

  delete = async (req: Request, res: Response): Promise<any> => {
    const id = Number(req.params.id);
    try {
      const data = await this.userService.delete(id);
      return successResponse(res, data, "Delete user success");
    } catch (error) {
      return errorResponse(res, "ERR Controller.deleteUser", 500);
    }
  };

  logout = async (req: Request, res: Response): Promise<any> => {
    try {
      res.clearCookie("access_token", {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return successResponse(res, 200, { status: "OK", message: "Logout success" });
    } catch (error) {
      console.log("Controller", error);
      return errorResponse(res, "ERR Controller.logout", 500);
    }
  };
}
