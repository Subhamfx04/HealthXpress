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

// GET /api/camps - Get all medical camps
router.get('/', async (req, res) => {
  try {
    const camps = await dbAll('SELECT * FROM camps ORDER BY date');
    res.json({
      camps: camps || []
    });
  } catch (err) {
    console.error('Error fetching camps:', err);
    res.status(500).json({ error: 'Failed to fetch camps' });
  }
});

// GET /api/camps/:id - Get single camp
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const camp = await dbGet('SELECT * FROM camps WHERE id = ?', [id]);

    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    res.json(camp);
  } catch (err) {
    console.error('Error fetching camp:', err);
    res.status(500).json({ error: 'Failed to fetch camp' });
  }
});

module.exports = router;
