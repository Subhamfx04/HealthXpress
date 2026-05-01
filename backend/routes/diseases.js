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

// GET /api/diseases - Get all diseases
router.get('/', async (req, res) => {
  try {
    const diseases = await dbAll('SELECT * FROM diseases ORDER BY id');
    res.json({
      diseases: diseases || []
    });
  } catch (err) {
    console.error('Error fetching diseases:', err);
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
});

// GET /api/diseases/:id - Get single disease
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const disease = await dbGet('SELECT * FROM diseases WHERE id = ?', [id]);

    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' });
    }

    res.json(disease);
  } catch (err) {
    console.error('Error fetching disease:', err);
    res.status(500).json({ error: 'Failed to fetch disease' });
  }
});

module.exports = router;
