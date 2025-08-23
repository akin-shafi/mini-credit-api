import fs from "fs";
import csv from "csv-parser";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  balance: number;
}

export const parseCSV = (filePath: string): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const results: Transaction[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        const date = data.date || data.Date;
        const description = data.description || data.Description;
        const amountStr = data.amount || data.Amount;
        const balanceStr = data.balance || data.Balance;

        const amount = parseFloat((amountStr || "0").replace(/,/g, ""));
        const balance = parseFloat((balanceStr || "0").replace(/,/g, ""));

        if (!date || !description || isNaN(amount) || isNaN(balance)) {
          console.warn("⚠️ Skipping invalid row:", data);
          return;
        }

        // if (isNaN(amount) || isNaN(balance)) {
        //   console.warn("⚠️ Skipping invalid row:", data);
        //   return;
        // }

        results.push({ date, description, amount, balance });
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};
