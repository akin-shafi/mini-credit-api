import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

// Authenticate JWT
export const authenticateJWT = (
  req: Request & AuthRequest, // ✅ merge types
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"]; // ✅ safer: indexed access

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "supersecret";
    const decoded = jwt.verify(token, secret);
    (req as AuthRequest).user = decoded; // ✅ cast to add user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Role-based authorization
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
