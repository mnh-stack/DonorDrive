const orgVerificationRouter = require('./routes/orgVerification');
const fs = require('fs');
const path = require('path');

// Ensure uploads/org_verification directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'org_verification');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/api/org-verification', orgVerificationRouter); 