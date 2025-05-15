const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/org_verification');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for org verification document uploads
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

// POST /api/org-verification/upload
router.post('/upload', upload.single('document'), async (req, res) => {
  const db = req.app.get('db');
  const userId = req.body.user_id;

  // Log incoming upload attempt
  console.log('[ORG VERIFICATION UPLOAD ATTEMPT]', {
    userId,
    file: req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename
    } : null
  });

  // Validate user ID
  if (!userId || isNaN(Number(userId))) {
    console.log('[UPLOAD ERROR] Invalid user ID:', userId);
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  // Check if file was uploaded
  if (!req.file) {
    console.log('[UPLOAD ERROR] No document uploaded for user:', userId);
    return res.status(400).json({ error: 'No document uploaded.' });
  }

  try {
    // Check if user exists
    const [userRows] = await db.query('SELECT id FROM users WHERE id=? AND user_type="organization"', [userId]);
    if (!userRows.length) {
      return res.status(400).json({ error: 'User does not exist or is not an organization.' });
    }

    // Insert into org_verification
    await db.query(
      'INSERT INTO org_verification (user_id, document_path, status) VALUES (?, ?, ?)',
      [userId, req.file.filename, 'pending']
    );

    // Update user verification status
    await db.query('UPDATE users SET verification_status=? WHERE id=?', ['pending', userId]);

    res.json({ message: 'Document uploaded. Verification pending.' });
  } catch (err) {
    console.error('[ORG VERIFICATION UPLOAD ERROR]', {
      message: err.message,
      stack: err.stack,
      userId,
      filename: req.file?.filename
    });

    // Clean up uploaded file if database operation fails
    if (req.file) {
      try {
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
      } catch (unlinkErr) {
        console.error('[FILE CLEANUP ERROR]', unlinkErr);
      }
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'User does not exist.' });
    }
    res.status(500).json({ error: 'Server error. Please try again later.', details: err.message });
  }
});

// GET /api/org-verification/status?user_id=123
router.get('/status', async (req, res) => {
  const db = req.app.get('db');
  const userId = req.query.user_id;

  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  try {
    const [userRows] = await db.query('SELECT verification_status FROM users WHERE id=?', [userId]);
    const [verRows] = await db.query('SELECT * FROM org_verification WHERE user_id=? ORDER BY submitted_at DESC LIMIT 1', [userId]);
    res.json({
      verification_status: userRows[0]?.verification_status || 'unverified',
      verification_request: verRows[0] || null
    });
  } catch (err) {
    console.error('[ORG VERIFICATION STATUS ERROR]', {
      message: err.message,
      stack: err.stack,
      userId
    });
    res.status(500).json({ error: 'Server error. Please try again later.', details: err.message });
  }
});

// POST /api/org-verification/review (admin only)
router.post('/review', async (req, res) => {
  const db = req.app.get('db');
  const { request_id, status, reviewer_id, review_notes } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  try {
    // Update verification request
    await db.query(
      'UPDATE org_verification SET status=?, reviewed_at=NOW(), reviewer_id=?, review_notes=? WHERE id=?',
      [status, reviewer_id, review_notes, request_id]
    );

    // Update user status
    const [verRows] = await db.query('SELECT user_id FROM org_verification WHERE id=?', [request_id]);
    if (verRows.length > 0) {
      const newStatus = status === 'approved' ? 'verified' : 'rejected';
      await db.query('UPDATE users SET verification_status=? WHERE id=?', [newStatus, verRows[0].user_id]);
    }

    res.json({ message: 'Review complete.' });
  } catch (err) {
    console.error('[ORG VERIFICATION REVIEW ERROR]', {
      message: err.message,
      stack: err.stack,
      request_id,
      status
    });
    res.status(500).json({ error: 'Server error. Please try again later.', details: err.message });
  }
});

module.exports = router;