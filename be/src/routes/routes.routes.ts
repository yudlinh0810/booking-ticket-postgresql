import express, { Request, Response } from "express";
import { errorHandler } from "../middlewares/error.middleware";
import busRouter from "./car.routes";
import customerRouter from "./customer.routes";
import locationRouter from "./location.routes";
import userRouter from "./user.routes";
import driverRoute from "./driver.routes";
import coDriverRoute from "./coDriver.route";
import adminRoute from "./admin.routes";
import tripRoute from "./trip.routes";
import promotionRoute from "./promotion.route";
import ticketRoute from "./ticket.routes";
import payOSRoute from "./payos.routes";
import webhookPayOsRoute from "./webhook.routes";
import statisticalRoute from "./statistical.route";
import revenueRoute from "./revenue.routes";
// import oAuth2 from "./oAuth2.route";
import authRoute from "./auth.routes";

const routes = (app: express.Application): void => {
  // Cấu hình routes
  app.use("/api/users/auth", userRouter);
  app.use("/api/locations", locationRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/cars", busRouter);
  app.use("/api/drivers", driverRoute);
  app.use("/api/co-drivers", coDriverRoute);
  app.use("/api/admins", adminRoute);
  app.use("/api/trips", tripRoute);
  app.use("/api/promotions", promotionRoute);
  app.use("/api/tickets", ticketRoute);
  app.use("/api/payos", payOSRoute);
  app.use("/api/webhook", webhookPayOsRoute);
  app.use("/api/statisticals", statisticalRoute);
  app.use("/api/revenues", revenueRoute);
  // app.use("/auth", oAuth2); // Server-side Redirect Flow
  app.use("/api/auth", authRoute); // Client-side Implicit Flow

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
