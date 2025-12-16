// import { CustomerService } from "@/services/customer.service";
// import dotenv from "dotenv";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// dotenv.config();

// const customerService = new CustomerService();

// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//   throw new Error("Missing Google OAuth credentials");
// }

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       // callbackURL: `https://${process.env.CALLBACK_URL}.ngrok-free.app/auth/google/callback`,  // domain ngrok
//       callbackURL: `https://${process.env.CALLBACK_URL}.onrender.com/auth/google/callback`, // domain render
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const customer = await customerService.loginOAuthWithGoogle(profile);

//         if (customer.status !== "OK") {
//           done(null, false, { message: "User not found" });
//         } else {
//           const userData = {
//             email: customer.email,
//             access_token: customer.access_token,
//             refresh_token: customer.refresh_token,
//             provider_id: profile.id,
//           };
//           return done(null, userData);
//         }
//       } catch (error) {
//         console.error("Error saving customer:", error);
//         return done(error);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done) => {
//   done(null, user);
// });

// passport.deserializeUser(async (user: any, done) => {
//   done(null, user);
// });
