require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const cctvReportRoutes = require('./routes/cctvReportRoutes');
const dailySurveillanceStatusRoutes = require('./routes/dailySurveillanceStatusRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware with increased payload limits for image uploads
app.use(cors());
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '50mb' })); // Increased from default 100kb to 50mb
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_FILE_SIZE || '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mojaz_support_program';

// Ensure default admin exists on server start
async function ensureDefaultAdmin() {
  const admin = await User.findOne({ username: process.env.DEFAULT_ADMIN_USERNAME || 'saliha', role: process.env.DEFAULT_ADMIN_ROLE || 'admin' });
  if (!admin) {
    await User.create({ 
      username: process.env.DEFAULT_ADMIN_USERNAME || 'saliha', 
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin1234', 
      role: process.env.DEFAULT_ADMIN_ROLE || 'admin' 
    });
    console.log(`Default admin user created: ${process.env.DEFAULT_ADMIN_USERNAME || 'saliha'} / ${process.env.DEFAULT_ADMIN_PASSWORD || 'admin1234'}`);
  } else {
    console.log('Default admin user already exists.');
  }
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully');
    await ensureDefaultAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Routes
app.use('/api/reports', cctvReportRoutes);
app.use('/api/daily-surveillance', dailySurveillanceStatusRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MOJAZ Support Program Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  
  // Handle payload too large error specifically
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ 
      error: 'Payload too large. Please reduce image size or upload fewer images.',
      details: `Received ${error.length} bytes, limit is ${error.limit} bytes`
    });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 MongoDB URI: ${MONGODB_URI}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 API endpoints: http://localhost:${PORT}/api/reports`);
  console.log(`📝 API endpoints: http://localhost:${PORT}/api/daily-surveillance`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

module.exports = app;
