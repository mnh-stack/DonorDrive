const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  const db = req.app.get('db');
  const { name, email, password, user_type } = req.body;

  // Log registration attempt
  console.log(`[REGISTER ATTEMPT] Name: ${name}, Email: ${email}, User Type: ${user_type}`);

  // Check for JWT_SECRET and EMAIL_FROM
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set in environment variables!');
  }
  if (!process.env.EMAIL_FROM) {
    console.warn('Warning: EMAIL_FROM is not set in environment variables!');
  } else {
    console.log('EMAIL_FROM loaded:', process.env.EMAIL_FROM);
  }

  // Basic validation
  if (!name || !email || !password || !user_type) {
    console.log('[REGISTER ERROR] Missing required fields.');
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log('[REGISTER ERROR] Invalid email format.');
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  if (password.length < 6) {
    console.log('[REGISTER ERROR] Password too short.');
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  if (!['individual', 'organization'].includes(user_type)) {
    console.log('[REGISTER ERROR] Invalid user type.');
    return res.status(400).json({ error: 'Invalid user type.' });
  }

  try {
    // Check if email already exists
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log(`[REGISTER ERROR] Email already registered: ${email}`);
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Generate verification token
    const verification_token = crypto.randomBytes(32).toString('hex');

    // Insert user
    await db.query(
      'INSERT INTO users (name, email, password_hash, user_type, verification_token) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, user_type, verification_token]
    );

    // Send verification email using Nodemailer
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/verify-email?token=${verification_token}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your DonorDrive account',
      html: `<p>Click the link to verify your account:</p><a href="${verifyUrl}">${verifyUrl}</a>`
    });
    console.log(`[REGISTER SUCCESS] User registered: ${email}`);
    console.log(`Verification email sent to: ${email}`);

    res.json({ message: 'Registration successful! Please check your email to verify your account.' });
  } catch (err) {
    console.error('[REGISTER ERROR] Registration error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/verify-email
router.get('/verify-email', async (req, res) => {
  const db = req.app.get('db');
  const { token } = req.query;
  if (!token) {
    return res.status(400).send(`
      <html><head><title>Email Verification</title></head><body style="font-family:sans-serif;text-align:center;padding:3rem;background:#f8fafc;">
        <h2 style="color:#dc2626;">Invalid verification link</h2>
        <p>Missing verification token.</p>
      </body></html>
    `);
  }
  try {
    const [rows] = await db.query('SELECT id, is_verified FROM users WHERE verification_token = ?', [token]);
    if (rows.length === 0) {
      return res.status(400).send(`
        <html><head><title>Email Verification</title></head><body style="font-family:sans-serif;text-align:center;padding:3rem;background:#f8fafc;">
          <h2 style="color:#dc2626;">Invalid or expired link</h2>
          <p>This verification link is invalid or has already been used.</p>
        </body></html>
      `);
    }
    const user = rows[0];
    if (user.is_verified) {
      return res.send(`
        <html><head><title>Email Verification</title></head><body style="font-family:sans-serif;text-align:center;padding:3rem;background:#f8fafc;">
          <h2 style="color:#16a34a;">Email Already Verified</h2>
          <p>Your email has already been verified. You can now log in.</p>
        </body></html>
      `);
    }
    await db.query('UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?', [user.id]);
    return res.send(`
      <html><head><title>Email Verification</title></head><body style="font-family:sans-serif;text-align:center;padding:3rem;background:#f8fafc;">
        <h2 style="color:#16a34a;">Email Verified!</h2>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
      </body></html>
    `);
  } catch (err) {
    console.error('[VERIFY EMAIL ERROR]', err);
    return res.status(500).send(`
      <html><head><title>Email Verification</title></head><body style="font-family:sans-serif;text-align:center;padding:3rem;background:#f8fafc;">
        <h2 style="color:#dc2626;">Server Error</h2>
        <p>Something went wrong. Please try again later.</p>
      </body></html>
    `);
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const db = req.app.get('db');
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const [rows] = await db.query('SELECT id, password_hash, is_verified, user_type FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const user = rows[0];
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    // Return user_type and id for frontend redirect
    const data = { message: 'Login successful!', user_type: user.user_type, id: user.id };
    console.log('LOGIN RESPONSE:', data);
    return res.json(data);
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// PUT /api/profile
router.put('/profile', async (req, res) => {
  const db = req.app.get('db');
  const { email, name, bio, contact, photo_url, visibility } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  try {
    await db.query(
      'UPDATE users SET name=?, bio=?, contact=?, photo_url=?, visibility=? WHERE email=?',
      [name, bio, contact, photo_url, visibility, email]
    );
    res.json({ message: 'Profile updated!' });
  } catch (err) {
    console.error('[PROFILE UPDATE ERROR]', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/profile
router.get('/profile', async (req, res) => {
  const db = req.app.get('db');
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id is required.' });
  try {
    const [rows] = await db.query('SELECT id, name, email, bio, contact, photo_url, visibility, user_type FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[PROFILE FETCH ERROR]', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router; 