const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());      // 👈 هنا نحطوها
app.use(express.json());

// ✅ Connexion Neon (SSL obligatoire)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Test database
app.get("/", (req, res) => {
  res.json({ message: "Backend working" });
});
// test API route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working 🚀" });
});
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected ✅",
      time: result.rows[0],
    });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
