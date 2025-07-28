import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import passport from "passport";
import { config } from "./config/config";
import "./config/passport";
import { connectRedis } from "./config/redis";
import routes from "./routes/routes.routes";
import { setupSocketServer } from "./sockets/socket";
import { logger } from "./middlewares/logger";

dotenv.config();

const app = express();
const server = createServer(app);

// 1. CORS phải đến trước session
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.URL_LOCALHOST,
      process.env.URL_FRONTEND_CLIENT,
      process.env.URL_FRONTEND_ADMIN,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 2. Body parsers trước session
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(logger); // Use logger middleware

// 3. Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yudlinh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    name: "sessionId",
  })
);

// 4. Passport middleware - say session
app.use(passport.initialize());
app.use(passport.session());

// Khởi động Websocket
setupSocketServer(server);

// Test route
app.get("/", (_, res) => {
  res.send("Server running ...");
});

// Gọi routes - sau khi setup xong các middleware
routes(app);

// Start server
async function startServer() {
  try {
    await connectRedis();
    console.log("Redis connected successfully");

    const port = config.PORT || 3004;
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect Redis", error);
    process.exit(1);
  }
}

startServer();
