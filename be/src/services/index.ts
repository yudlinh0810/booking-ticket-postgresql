import { AdminService } from "./admin.service";
import { EmailService } from "./email.service";
import { UserService } from "./user.service";
import { CustomerService } from "./customer.service";
import { DriverService } from "./driver.service";
import { CoDriverService } from "./coDriver.service";
import { LocationService } from "./location.service";
import { CarService } from "./car.service";
import { CouponService } from "./coupon.service";
import { SeatService } from "./seat.service";
import { TicketService } from "./ticket.service";
import { TripService } from "./trip.service";
import { AuthService } from "./auth.service";
import { userCacheService } from "./cache";

const authService = new AuthService();
const emailService = new EmailService();
const userService = new UserService(userCacheService, emailService);
const adminService = new AdminService();
const customerService = new CustomerService(authService, userService);
const driverService = new DriverService();
const coDriverService = new CoDriverService();
const locationService = new LocationService();
const carService = new CarService();
const tripService = new TripService();
const seatService = new SeatService();
const ticketService = new TicketService();
const couponService = new CouponService();

export {
  authService,
  emailService,
  userService,
  adminService,
  customerService,
  driverService,
  coDriverService,
  locationService,
  carService,
  tripService,
  seatService,
  couponService,
  ticketService,
};
