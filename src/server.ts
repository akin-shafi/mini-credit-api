import app from "./app";
import { AppDataSource } from "./config/db";
import { runSeeder } from "./config/seeder";

const PORT = process.env.PORT || 3000;
// const baseUrl = process.env.baseUrl || "http://localhost";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : process.env.baseUrl;
AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Database connected");

    // Run user seeder
    await runSeeder();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${baseUrl}:${PORT}`);
      console.log(`📖 Swagger docs at ${baseUrl}:${PORT}/api-docs`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));
