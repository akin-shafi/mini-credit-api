import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import statementRoutes from "./routes/statementRoutes";
import insightRoutes from "./routes/insightRoutes";
import bureauRoutes from "./routes/bureauRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { setupSwagger } from "./config/swagger";
import { apiLimiter } from "./config/rateLimiter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- CORS Setup ----------------
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ---------------- Rate Limiting ----------------
app.use("/api", apiLimiter);

// ---------------- Swagger Docs ----------------
setupSwagger(app);

// ---------------- Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/bureau", bureauRoutes);

// ---------------- Health Check ----------------
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ---------------- Error Handler ----------------
app.use(errorHandler);

export default app;
