const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// Updated path assumption: .env is in the project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- Import Routes ---
const authRoutes = require('./routes/auth');
// Import the 5 new QC Routes
const tensileTests = require('./routes/tensileRoutes');
const qcReports = require('./routes/qcProductionRoutes');
const microStructure = require('./routes/microStructureRoutes');
const impactTests = require('./routes/impactRoutes');
const microTensileTests = require('./routes/microTensileRoutes');
// const processRoutes = require('./routes/processRoutes'); // Commented out - frontend only for now

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes ---
// Existing Routes
app.use('/api/auth', authRoutes);

// New QC Report Routes (Using /api/v1/ prefix for versioning)
app.use('/api/v1/tensile-tests', tensileTests);
app.use('/api/v1/qc-reports', qcReports);
app.use('/api/v1/micro-structure', microStructure);
app.use('/api/v1/impact-tests', impactTests);
app.use('/api/v1/micro-tensile-tests', microTensileTests);
// app.use('/api/v1/process-records', processRoutes); // Commented out - frontend only for now

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  // Simple error logging
  console.error(err.stack); 
  res.status(500).json({ message: 'Internal server error' });
});

// 404 Handler (Catch-all for undefined routes)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});