import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { bookBusTicketsDB } from "./db";
import { CustomerService } from "../services/customer.service";

dotenv.config();

const customerService = new CustomerService(bookBusTicketsDB);

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://${process.env.CALLBACK_URL}.ngrok-free.app/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);
        const customer = await customerService.save(profile, "google");
        return done(null, customer);
      } catch (error) {
        console.error("Error saving customer:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await bookBusTicketsDB.execute("select * from customer where provider_id = ?", [
      id,
    ]);
    const customer = (rows as any)[0];
    if (!customer) return done(null, false);
    done(null, customer);
  } catch (error) {
    done(error, null);
  }
});
