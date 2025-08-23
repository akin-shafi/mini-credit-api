import { compute } from "../src/services/insightService";
import { Insight } from "../src/entities/Insight";
import { Transaction } from "../src/entities/Transaction";

jest.mock("../src/config/db", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      if (entity === Insight) return mockInsightRepo;
      if (entity === Transaction) return mockTransactionRepo;
    }),
  },
}));

// Mock Repositories
const mockInsightRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockTransactionRepo = {
  find: jest.fn(),
};

describe("insightService.compute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should compute insights correctly", async () => {
    mockTransactionRepo.find.mockResolvedValue([
      { amount: 1000, description: "salary", statement: { user: { id: 1 } } },
      { amount: -200, description: "food", statement: { user: { id: 1 } } },
      {
        amount: -100,
        description: "bill payment",
        statement: { user: { id: 1 } },
      },
    ]);

    mockInsightRepo.create.mockImplementation((data) => data);
    mockInsightRepo.save.mockImplementation((data) => ({
      id: 1,
      ...data,
    }));

    const result = await compute(1);

    expect(result.totalInflow).toBe(1000);
    expect(result.totalOutflow).toBe(300);
    expect(result.netFlow).toBe(700);
    expect(result.avgIncome).toBe(1000);
    expect(result.spendBuckets.food).toBe(200);
    expect(result.spendBuckets.bills).toBe(100);
    expect(result.riskFlags).toEqual([]);
  });

  it("should flag negative cash flow", async () => {
    mockTransactionRepo.find.mockResolvedValue([
      { amount: 500, description: "salary", statement: { user: { id: 1 } } },
      {
        amount: -800,
        description: "rent bill",
        statement: { user: { id: 1 } },
      },
    ]);

    mockInsightRepo.create.mockImplementation((data) => data);
    mockInsightRepo.save.mockImplementation((data) => ({
      id: 2,
      ...data,
    }));

    const result = await compute(1);

    expect(result.netFlow).toBe(-300);
    expect(result.riskFlags).toContain("NEGATIVE_CASH_FLOW");
  });

  it("should throw error when no transactions found", async () => {
    mockTransactionRepo.find.mockResolvedValue([]);

    await expect(compute(1)).rejects.toThrow("No transactions found");
  });
});
