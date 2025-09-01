import app from "./app";
import { AppDataSource } from "./config/db";
import { runSeeder } from "./config/seeder";

const PORT = process.env.PORT || 3000;
const HOST = process.env.BASE_URL || "http://localhost";
const BASE_URL = `${HOST}:${PORT}`;

AppDataSource.initialize() 
  .then(async () => {
    console.log("✅ Database connected");

    // Run user seeder
    await runSeeder();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${BASE_URL}`);
      console.log(`📖 Swagger docs at ${BASE_URL}/api-docs`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));
