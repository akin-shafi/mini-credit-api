import { Request, Response } from "express";
import * as bureauService from "../services/bureauService";

export const checkBureau = async (req: Request, res: Response) => {
  try {
    const { userId, bvn } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // If using a real API, BVN is required
    if (process.env.BUREAU_API_URL && process.env.BUREAU_API_KEY) {
      if (!bvn) {
        return res
          .status(400)
          .json({ message: "bvn is required when using external Bureau API" });
      }
    }

    const report = await bureauService.check(userId, req.body);
    return res.status(201).json(report);
  } catch (err: any) {
    console.error("❌ Bureau check failed:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
