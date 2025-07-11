import express from "express";
import passport from "passport";
import { authO2Controller } from "../controllers/oAuth2.controller";

const router = express.Router();

router.get(
  "/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/login?error=oauth_failed",
    session: true,
  })
);

export default router;
