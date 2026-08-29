import express from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import logger from "./shared/infrastructure/logger.js";
import { MEDIA_ROOT } from "./shared/utils/local-storage.js";

const app = express();

// Behind a reverse proxy / load balancer (prod), trust X-Forwarded-For so req.ip
// reflects the real client IP — required for geo-IP session-location resolution.
app.set("trust proxy", true);

const captureRawJsonBody = (req, _res, buf) => {
  if (buf?.length) {
    req.rawBody = buf.toString("utf8");
  }
};

const allowedOrigins = [
  "http://localhost:5173",  // ecommerce frontend dev
  "http://localhost:8080",  // admin dashboard dev
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // No Origin header: server-to-server webhooks, mobile apps, curl/Postman — pass through
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // TEMPORARY MONITORING MODE: log but still allow.
    // After 24-48h audit, replace this with: return callback(new Error(`CORS: origin ${origin} not allowed`), false);
    logger.warn("CORS: unwhitelisted origin allowed (monitoring mode)", { origin });
    return callback(null, true);
  },
  credentials: true,
}));

app.use(helmet());
if (process.env.NODE_ENV === "production") {
  // Production: Apache "combined" format piped through Winston as structured JSON
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
} else {
  // Local dev: human-readable coloured output
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10mb", verify: captureRawJsonBody }));
app.use(express.urlencoded({ extended: true })); // required for PayU form-POST callbacks

// Locally-stored media (product images/reels, banners) — replaces Cloudinary/ImageKit.
// Cross-Origin-Resource-Policy is forced to "cross-origin" so the storefront, served
// from a different origin, can embed these <img>/<video> assets (helmet defaults to
// same-origin, which would block them). Long cache since filenames are unique per upload.
app.use(
  "/media",
  express.static(MEDIA_ROOT, {
    maxAge: "7d",
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// all routes under /api
app.use("/api", routes);

// health check
app.get("/", (_req, res) => {
  res.send("  ✦  Victory Media Dashboard backend is running!");
});

// global error handler
app.use((err, _req, res, _next) => {
  // AppError sets `httpStatus`; a handful of services throw a plain Error with
  // `.statusCode` set by hand instead — both are honoured so those messages
  // (e.g. "No valid rows found...") reach the client instead of collapsing
  // into a generic 500.
  const status = err.httpStatus || err.statusCode || 500;
  const payload = typeof err.toJSON === "function" ? err.toJSON() : null;
  const isClientError = status >= 400 && status < 500;
  const isServerError = status >= 500 && status < 600;

  let message = payload?.message || err.message || "Internal server error";
  let errorCode = payload?.error || err.code || "INTERNAL_SERVER_ERROR";

  if (isServerError) {
    message = "Internal server error";
    errorCode = "INTERNAL_SERVER_ERROR";
  }

  logger.error("Server error", {
    status,
    errorCode,
    message: err.message,
    stack: err.stack,
    payload,
  });


  const response = {
    success: false,
    message,
    data: null,
    error: errorCode,
  };

  if (payload?.details && (isClientError || payload?.safeToExpose === true)) {
    response.details = payload.details;
  }

  res.status(status).json(response);
});

export default app;
