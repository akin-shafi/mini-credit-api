import app from "./app";
import { AppDataSource } from "./config/db";
import { runSeeder } from "./config/seeder";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Database connected");

    // Run user seeder
    await runSeeder();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));
