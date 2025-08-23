import { Request, Response } from "express";
import * as statementService from "../services/statementService";

export const uploadStatement = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ message: "CSV file required" });
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const statement = await statementService.processCSV(userId, req.file.path);
    res.status(201).json(statement);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
