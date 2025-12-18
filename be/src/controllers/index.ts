import { AdminController } from "./admin.controller";
import { AuthController } from "./auth.controller";
import { CarController } from "./car.controller";
import { CoDriverController } from "./coDriver.controller";
import { CouponController } from "./coupon.controller";
import { CustomerController } from "./customer.controller";
import { DriverController } from "./driver.controller";
import { LocationController } from "./location.controller";
import { ManagerController } from "./manager.controller";
import { PayOSController } from "./payos.controller";
import { SeatController } from "./seat.controller";
import { TicketController } from "./ticket.controller";
import { TripController } from "./trip.controller";
import { UserController } from "./user.controller";
import { WebhookController } from "./webhook.controller";

const authController = new AuthController();
const userController = new UserController();
const adminController = new AdminController();
const managerController = new ManagerController();
const customerController = new CustomerController();
const driverController = new DriverController();
const coDriverController = new CoDriverController();
const locationController = new LocationController();
const couponController = new CouponController();
const carController = new CarController();
const tripController = new TripController();
const seatController = new SeatController();
const ticketController = new TicketController();
const webhookController = new WebhookController();
const payOSController = new PayOSController();

export {
  authController,
  userController,
  adminController,
  managerController,
  customerController,
  driverController,
  coDriverController,
  locationController,
  couponController,
  carController,
  tripController,
  seatController,
  ticketController,
  webhookController,
  payOSController,
};
