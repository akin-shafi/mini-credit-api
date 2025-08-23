import { AppDataSource } from "../config/db";
import { Insight } from "../entities/Insight";
import { Transaction } from "../entities/Transaction";

const insightRepo = AppDataSource.getRepository(Insight);
const transactionRepo = AppDataSource.getRepository(Transaction);

export const compute = async (userId: number) => {
  const transactions = await transactionRepo.find({
    relations: ["statement", "statement.user"],
    where: { statement: { user: { id: userId } } },
  });

  if (!transactions.length) throw new Error("No transactions found");

  const inflows = transactions
    .filter((t) => typeof t.amount === "number" && t.amount > 0)
    .map((t) => t.amount);

  const outflows = transactions
    .filter((t) => typeof t.amount === "number" && t.amount < 0)
    .map((t) => Math.abs(t.amount));

  const avgIncome =
    inflows.length > 0
      ? inflows.reduce((a, b) => a + b, 0) / inflows.length
      : 0;

  const totalInflow = inflows.reduce((a, b) => a + b, 0);
  const totalOutflow = outflows.reduce((a, b) => a + b, 0);
  const netFlow = totalInflow - totalOutflow;

  const spendBuckets: Record<string, number> = { food: 0, bills: 0, others: 0 };
  transactions.forEach((t) => {
    const desc = (t.description || "").toLowerCase();
    if (desc.includes("food")) spendBuckets.food += Math.abs(t.amount || 0);
    else if (desc.includes("bill"))
      spendBuckets.bills += Math.abs(t.amount || 0);
    else spendBuckets.others += Math.abs(t.amount || 0);
  });

  const insight = insightRepo.create({
    user: { id: userId } as any,
    avgIncome,
    totalInflow,
    totalOutflow,
    netFlow,
    spendBuckets,
    riskFlags: netFlow < 0 ? ["NEGATIVE_CASH_FLOW"] : [],
  });

  return await insightRepo.save(insight);
};

export const getById = async (id: number) => {
  return await insightRepo.findOne({ where: { id } });
};
