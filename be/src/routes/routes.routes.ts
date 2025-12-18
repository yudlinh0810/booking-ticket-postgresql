import express, { Request, Response } from "express";
import { errorHandler } from "../middlewares/error.middleware";
import adminRouter from "./admin.routes";
import authRouter from "./auth.routes";
import busRouter from "./car.routes";
import coDriverRouter from "./coDriver.route";
import promotionRouter from "./coupon.route";
import customerRouter from "./customer.routes";
import driverRouter from "./driver.routes";
import locationRouter from "./location.routes";
import payOSRouter from "./payos.routes";
import statisticalRouter from "./statistical.route";
import ticketRouter from "./ticket.routes";
import tripRouter from "./trip.routes";
import userRouter from "./user.routes";
import webhookPayOsRouter from "./webhook.routes";
// import oAuth2 from "./oAuth2.route";

const routes = (app: express.Application): void => {
  // Cấu hình routes
  app.use("/api/users/auth", userRouter);
  app.use("/api/locations", locationRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/cars", busRouter);
  app.use("/api/drivers", driverRouter);
  app.use("/api/co-drivers", coDriverRouter);
  app.use("/api/admins", adminRouter);
  app.use("/api/trips", tripRouter);
  app.use("/api/promotions", promotionRouter);
  app.use("/api/tickets", ticketRouter);
  app.use("/api/payos", payOSRouter);
  app.use("/api/webhook", webhookPayOsRouter);
  app.use("/api/statisticals", statisticalRouter);
  // app.use("/auth", oAuth2); // Server-side Redirect Flow
  app.use("/api/auth", authRouter); // Client-side Implicit Flow

  // Route cho các yêu cầu không tìm thấy
  app.use((req: Request, res: Response): void => {
    res.status(404).json({
      status: "ERROR",
      message: "404 NOT FOUND!",
    });
  });

  // Route xử lý lỗi
  app.use(errorHandler);
};

export default routes;
