const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Neon PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* =========================
   TEST ROUTES
========================= */

// Backend test
app.get("/", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

// API test
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

// DB test
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

/* =========================
   PARKING ROUTES
========================= */

// ✅ Get all parking spots
app.get("/api/parking", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM parking ORDER BY number ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Toggle parking status
app.put("/api/parking/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE parking 
       SET status = CASE 
         WHEN status = 'free' THEN 'occupied' 
         ELSE 'free' 
       END
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   START SERVER
========================= */

const PORT = 5008;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${5008} 🚀`);
});
