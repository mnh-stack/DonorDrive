const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/campaign_images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for campaign image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/campaigns/create
router.post('/create', upload.single('image'), async (req, res) => {
  const db = req.app.get('db');
  const userId = req.body.user_id;
  const { title, description, goal_amount, end_date, category } = req.body;

  // Basic validation
  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }
  if (!title || !goal_amount || !end_date || !category) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Image is required.' });
  }

  try {
    // Insert into campaigns
    await db.query(
      'INSERT INTO campaigns (user_id, title, description, goal_amount, end_date, category, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description, goal_amount, end_date, category, req.file.filename]
    );
    res.json({ message: 'Campaign created successfully.' });
  } catch (err) {
    console.error('[CAMPAIGN CREATION ERROR]', err);
    // Clean up uploaded file if DB operation fails
    if (req.file) {
      try { fs.unlinkSync(path.join(uploadDir, req.file.filename)); } catch {}
    }
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/campaigns/:id - Fetch campaign details
router.get('/:id', async (req, res) => {
  const db = req.app.get('db');
  const campaignId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM campaigns WHERE id=?', [campaignId]);
    if (!rows.length) return res.status(404).json({ error: 'Campaign not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[CAMPAIGN FETCH ERROR]', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// PUT /api/campaigns/:id/edit - Edit campaign details
router.put('/:id/edit', upload.single('image'), async (req, res) => {
  const db = req.app.get('db');
  const campaignId = req.params.id;
  const { title, description, goal_amount, end_date, category } = req.body;

  // Basic validation
  if (!title || !goal_amount || !end_date || !category) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Fetch current campaign
    const [rows] = await db.query('SELECT * FROM campaigns WHERE id=?', [campaignId]);
    if (!rows.length) return res.status(404).json({ error: 'Campaign not found.' });
    const current = rows[0];

    // Insert current version into campaign_versions
    await db.query(
      'INSERT INTO campaign_versions (campaign_id, user_id, title, description, goal_amount, end_date, category, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [campaignId, current.user_id, current.title, current.description, current.goal_amount, current.end_date, current.category, current.image_path]
    );

    // If new image uploaded, delete old image
    let imagePath = current.image_path;
    if (req.file) {
      if (imagePath) {
        try { fs.unlinkSync(path.join(uploadDir, imagePath)); } catch {}
      }
      imagePath = req.file.filename;
    }

    // Update campaign
    await db.query(
      'UPDATE campaigns SET title=?, description=?, goal_amount=?, end_date=?, category=?, image_path=? WHERE id=?',
      [title, description, goal_amount, end_date, category, imagePath, campaignId]
    );
    res.json({ message: 'Campaign updated successfully.' });
  } catch (err) {
    console.error('[CAMPAIGN EDIT ERROR]', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;