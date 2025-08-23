import axios from "axios";
import { AppDataSource } from "../config/db";
import { BureauReport } from "../entities/BureauReport";

const bureauRepo = AppDataSource.getRepository(BureauReport);

export const check = async (userId: number, payload: any) => {
  const API_URL = process.env.BUREAU_API_URL;
  const API_KEY = process.env.BUREAU_API_KEY;

  // ✅ If no external API configured, return a mock response
  if (!API_URL || !API_KEY) {
    console.warn(
      "⚠️ No BUREAU_API_URL/API_KEY set, returning mock Bureau response"
    );

    const mockData = {
      score: 720,
      risk_band: "LOW",
      enquiries_6m: 1,
      defaults: 0,
      open_loans: 2,
      trade_lines: 3,
      createdAt: new Date(),
    };

    const report = bureauRepo.create({
      user: { id: userId } as any,
      ...mockData,
    });
    return await bureauRepo.save(report);
  }

  // ✅ If API is configured, call the real Bureau API
  let retries = 3;
  let response;

  while (retries > 0) {
    try {
      response = await axios.post(API_URL, payload, {
        headers: { "X-API-KEY": API_KEY },
        timeout: 5000,
      });
      break;
    } catch (err: any) {
      retries--;
      if (retries === 0) throw new Error("Bureau API failed: " + err.message);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const data = response?.data;
  const report = bureauRepo.create({ user: { id: userId } as any, ...data });
  return await bureauRepo.save(report);
};
