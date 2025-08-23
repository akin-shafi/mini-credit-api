import "reflect-metadata";
import { DataSource } from "typeorm";

const connectWithRetry = async (
  dataSource: DataSource,
  retries = 5,
  delay = 5000
) => {
  for (let i = 0; i < retries; i++) {
    try {
      await dataSource.initialize();
      console.log("✅ Database connected");
      return dataSource;
    } catch (err) {
      console.error(
        `❌ DB connection attempt ${i + 1} failed. Retrying in ${
          delay / 1000
        }s...`,
        err.message
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("❌ Could not connect to database after retries");
};

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "db", // ✅ use service name
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "creditdb",
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entities/*.{ts,js}"],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
});

connectWithRetry(AppDataSource);
