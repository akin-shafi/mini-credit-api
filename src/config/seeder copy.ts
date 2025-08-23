import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/db";
import { User } from "../entities/User";
import { Statement } from "../entities/Statement";
import { Transaction } from "../entities/Transaction";

/**
 * Seed default users
 */
const seedUsers = async () => {
  const userRepo = AppDataSource.getRepository(User);

  const usersToSeed = [
    { email: "admin@test.com", password: "admin123", role: "admin" },
    { email: "user@test.com", password: "user123", role: "user" },
  ];

  const seededUsers: User[] = [];

  for (const u of usersToSeed) {
    let user = await userRepo.findOne({ where: { email: u.email } });
    if (!user) {
      const hashed = await bcrypt.hash(u.password, 10);
      user = userRepo.create({ email: u.email, password: hashed, role: u.role });
      await userRepo.save(user);
      console.log(`✅ Seeded user: ${u.email} (${u.role})`);
    } else {
      console.log(`ℹ️ User already exists: ${u.email}`);
    }
    seededUsers.push(user);
  }

  return seededUsers;
};

/**
 * Seed example statements and transactions for a given user
 */
const seedStatements = async (user: User) => {
  const statementRepo = AppDataSource.getRepository(Statement);
  const transactionRepo = AppDataSource.getRepository(Transaction);

  let statement = await statementRepo.findOne({
    where: { user: { id: user.id } },
    relations: ["user"],
  });

  if (!statement) {
    statement = statementRepo.create({
      user,
      filePath: "seeded.csv",
    });
    await statementRepo.save(statement);

    const txs = [
      { date: "2025-01-01", description: "Salary Payment", amount: 3000, balance: 3000 },
      { date: "2025-01-05", description: "Grocery Store", amount: -150, balance: 2850 },
      { date: "2025-01-10", description: "Electricity Bill", amount: -200, balance: 2650 },
    ];

    const transactions = txs.map((tx) =>
      transactionRepo.create({ ...tx, statement })
    );

    await transactionRepo.save(transactions);
    console.log(`✅ Seeded statement + transactions for user: ${user.email}`);
  } else {
    console.log(`ℹ️ Statement already exists for user: ${user.email}`);
  }
};

/**
 * Main seeder entry point
 */
export const runSeeder = async () => {
  const users = await seedUsers();
  for (const u of users) {
    if (u.role === "user") {
      await seedStatements(u);
    }
  }
};
