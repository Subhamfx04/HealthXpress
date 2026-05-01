const express = require('express');
const db = require('../db');

const router = express.Router();

// Helper function to promisify db.all
function dbAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Helper function to promisify db.get
function dbGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// GET /api/schemes - Get all government schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await dbAll('SELECT * FROM schemes ORDER BY id');
    res.json({
      schemes: schemes || []
    });
  } catch (err) {
    console.error('Error fetching schemes:', err);
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

// GET /api/schemes/:id - Get single scheme
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await dbGet('SELECT * FROM schemes WHERE id = ?', [id]);

    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    res.json(scheme);
  } catch (err) {
    console.error('Error fetching scheme:', err);
    res.status(500).json({ error: 'Failed to fetch scheme' });
  }
});

module.exports = router;
