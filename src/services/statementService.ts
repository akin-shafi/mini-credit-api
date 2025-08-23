import { AppDataSource } from "../config/db";
import { Statement } from "../entities/Statement";
import { Transaction } from "../entities/Transaction";
import { parseCSV } from "../utils/csvParser";

const statementRepo = AppDataSource.getRepository(Statement);
const transactionRepo = AppDataSource.getRepository(Transaction);

// export const processCSV = async (userId: number, filePath: string) => {
//   const statement = statementRepo.create({
//     user: { id: userId } as any,
//     filePath,
//   });
//   await statementRepo.save(statement);

//   const transactions = await parseCSV(filePath);
//   const txs = transactions.map((tx) =>
//     transactionRepo.create({ ...tx, statement: { id: statement.id } as any })
//   );
//   await transactionRepo.save(txs);

//   return { statement, transactions: txs };
// };

export const processCSV = async (userId: number, filePath: string) => {
  const statement = statementRepo.create({
    user: { id: userId } as any,
    filePath,
  });
  await statementRepo.save(statement);

  const transactions = await parseCSV(filePath);

  // 🛠️ Debug: log parsed transactions
  console.log("Parsed transactions:", transactions);

  // Filter out any invalid rows
  const validTxs = transactions.filter(
    (tx) => !isNaN(tx.amount) && !isNaN(tx.balance)
  );

  const txs = validTxs.map((tx) =>
    transactionRepo.create({ ...tx, statement: { id: statement.id } as any })
  );

  await transactionRepo.save(txs);

  return { statement, transactions: txs };
};
