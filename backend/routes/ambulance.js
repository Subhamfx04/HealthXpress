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

// POST /api/ambulance - Request ambulance
router.post('/', async (req, res) => {
  try {
    const { user_id, location, latitude, longitude } = req.body;

    if (!user_id || !location) {
      return res.status(400).json({ error: 'user_id and location are required' });
    }

    // Check if user exists
    const userCheck = await dbGet('SELECT id FROM users WHERE id = ?', [user_id]);
    if (!userCheck) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await dbRun(
      'INSERT INTO ambulance_requests (user_id, location, latitude, longitude, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, location, latitude || null, longitude || null, 'pending']
    );

    res.status(201).json({
      message: 'Ambulance request created',
      request: {
        id: result.lastID,
        user_id,
        location,
        latitude,
        longitude,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Ambulance request error:', err);
    res.status(500).json({ error: 'Failed to create ambulance request' });
  }
});

// GET /api/ambulance/:user_id - Get user's ambulance requests
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const requests = await dbAll(
      'SELECT * FROM ambulance_requests WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    res.json({
      requests: requests || []
    });
  } catch (err) {
    console.error('Error fetching ambulance requests:', err);
    res.status(500).json({ error: 'Failed to fetch ambulance requests' });
  }
});

// PUT /api/ambulance/:request_id - Update ambulance request status
router.put('/:request_id', async (req, res) => {
  try {
    const { request_id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'dispatched', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await dbRun(
      'UPDATE ambulance_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, request_id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const request = await dbGet('SELECT * FROM ambulance_requests WHERE id = ?', [request_id]);

    res.json({
      message: 'Ambulance request updated',
      request
    });
  } catch (err) {
    console.error('Error updating ambulance request:', err);
    res.status(500).json({ error: 'Failed to update ambulance request' });
  }
});

module.exports = router;
