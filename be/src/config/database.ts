import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render yêu cầu SSL
  },
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL on Render"))
  .catch((err) => console.error("Connection error", err));

export default pool;
