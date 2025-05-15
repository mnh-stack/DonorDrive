const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const authRoutes = require('./routes/auth');
const orgVerificationRoutes = require('./routes/orgVerification');
const campaignsRoutes = require('./routes/campaigns');
const ownerRoutes = require('./routes/owner');

dotenv.config({ path: '.env-donor' });

const app = express();
app.use(bodyParser.json());

async function startServer() {
  try {
    // MySQL connection pool
    const db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    app.set('db', db);
    app.use('/api', authRoutes);
    app.use('/api/org-verification', orgVerificationRoutes);
    app.use('/api/campaigns', campaignsRoutes);
    app.use('/api/owner', ownerRoutes);

    // Health check route
    app.get('/api/health', async (req, res) => {
      try {
        const db = req.app.get('db');
        await db.query('SELECT 1');
        res.json({ status: 'ok' });
      } catch (err) {
        console.error('[HEALTH CHECK ERROR]', err);
        res.status(500).json({ status: 'error', error: err.message });
      }
    });

    // Placeholder for future owner dashboard route
    app.get('/api/owner/dashboard', (req, res) => {
      res.json({ message: 'Owner dashboard route (to be implemented)' });
    });

    console.log('Mounted /api/org-verification routes');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MySQL:', err.message);
    process.exit(1);
  }
}

startServer(); 