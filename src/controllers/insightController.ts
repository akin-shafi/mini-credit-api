import { Request, Response } from "express";
import * as insightService from "../services/insightService";

export const runInsights = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const insights = await insightService.compute(userId);
    res.status(201).json(insights);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getInsights = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const insight = await insightService.getById(parseInt(id, 10));
    if (!insight) return res.status(404).json({ message: "Insights not found" });
    res.json(insight);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
