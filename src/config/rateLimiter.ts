import rateLimit from "express-rate-limit";

// Apply general rate limiting (100 requests per 15 mins per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
