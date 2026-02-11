const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ Connexion Neon (SSL obligatoire)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Test server فقط
app.get("/", (req, res) => {
  res.json({ message: "Server is running ✅" });
});

// ✅ Test database
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
const PORT = 5012;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
