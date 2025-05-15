const express = require('express');
const router = express.Router();

// POST /api/owner/login
router.post('/login', async (req, res) => {
  const db = req.app.get('db');
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM owners WHERE username=? AND password=?', [username, password]);
    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    res.json({ message: 'Login successful', owner_id: rows[0].id, username: rows[0].username });
  } catch (err) {
    console.error('[OWNER LOGIN ERROR]', err);
    res.status(500).json({ error: 'Server error. Please try again later.', details: err.message });
  }
});

// GET /api/owner/me?owner_id=1
router.get('/me', async (req, res) => {
  const db = req.app.get('db');
  const { owner_id } = req.query;
  if (!owner_id) return res.status(400).json({ error: 'owner_id is required.' });
  try {
    const [rows] = await db.query('SELECT id, username FROM owners WHERE id=?', [owner_id]);
    if (!rows.length) return res.status(404).json({ error: 'Owner not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[OWNER ME ERROR]', err);
    res.status(500).json({ error: 'Server error. Please try again later.', details: err.message });
  }
});

// GET /api/owner/list
router.get('/list', async (req, res) => {
  const db = req.app.get('db');
  try {
    const [rows] = await db.query('SELECT id, username FROM owners');
    res.json(rows);
  } catch (err) {
    console.error('[OWNER LIST ERROR]', err);
    res.status(500).json({ error: 'Server error. Please try again later.', details: err.message });
  }
});

module.exports = router; 