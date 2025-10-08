import express from "express";
import passport from "passport";

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
    failureRedirect: "/auth/failure",
    session: true,
  }),
  (req, res) => {
    console.log("Google login success:", req.user);
    res.redirect("/auth/success");
  }
);

router.get("/success", (req, res) => {
  res.cookie("access_token", req.user?.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refresh_token", req.user?.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });

  res.redirect("http://localhost:5173/?login=success");
});

router.get("/failure", (req, res) => {
  res.redirect("http://localhost:5173/?login=failed&reason=oauth-failed");
});

export default router;
