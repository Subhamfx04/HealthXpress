const express = require('express');
const db = require('../db');

const router = express.Router();

// Helper function to promisify db.run
function dbRun(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

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

// POST /api/consultations - Create consultation record
router.post('/', async (req, res) => {
  try {
    const { user_id, type } = req.body;

    if (!user_id || !type) {
      return res.status(400).json({ error: 'user_id and type are required' });
    }

    if (!['AI', 'physical'].includes(type)) {
      return res.status(400).json({ error: 'Type must be AI or physical' });
    }

    // Check if user exists
    const userCheck = await dbGet('SELECT id FROM users WHERE id = ?', [user_id]);
    if (!userCheck) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await dbRun(
      'INSERT INTO consultations (user_id, type, status) VALUES (?, ?, ?)',
      [user_id, type, 'pending']
    );

    res.status(201).json({
      message: 'Consultation record created',
      consultation: {
        id: result.lastID,
        user_id,
        type,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Consultation error:', err);
    res.status(500).json({ error: 'Failed to create consultation' });
  }
});

// GET /api/consultations/:user_id - Get user's consultations
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const consultations = await dbAll(
      'SELECT * FROM consultations WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    res.json({
      consultations: consultations || []
    });
  } catch (err) {
    console.error('Error fetching consultations:', err);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

module.exports = router;
