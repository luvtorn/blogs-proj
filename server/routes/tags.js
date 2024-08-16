const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags");
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Error in getting users" });
    }
    res.json(result.rows);
  } catch (error) {
    console.log(e);
  }
});

module.exports = router;
