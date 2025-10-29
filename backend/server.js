const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// Updated path assumption: .env is in the project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- Import ALL Routes ---
const authRoutes = require('./routes/auth');
// const itemRoutes = require('./routes/item'); // Assuming this was removed or no longer needed

// 5 QC Routes
const tensileTests = require('./routes/tensileRoutes');
const qcReports = require('./routes/qcProductionRoutes');
const microStructure = require('./routes/microStructureRoutes');
const impactTests = require('./routes/impactRoutes');
const microTensileTests = require('./routes/microTensileRoutes');

// Melting & Pouring/Process Routes (NEW IMPORTS)
const meltingLogs = require('./routes/meltingLogRoutes');
const cupolaHolderLogs = require('./routes/cupolaHolderLogRoutes');
const processLogs = require('./routes/processLogRoutes'); // Using 'processLogs' and 'processRoutes'

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- Routes ---
// Existing Routes
app.use('/api/auth', authRoutes);
// app.use('/api/items', itemRoutes); // If itemRoutes is still needed, uncomment this

// V1 QC and Production Log Routes
app.use('/api/v1/tensile-tests', tensileTests);
app.use('/api/v1/qc-reports', qcReports);
app.use('/api/v1/micro-structure', microStructure);
app.use('/api/v1/impact-tests', impactTests);
app.use('/api/v1/micro-tensile-tests', microTensileTests);

// V1 Melting and Process Routes (NEWLY ADDED)
app.use('/api/v1/melting-logs', meltingLogs);
app.use('/api/v1/cupola-holder-logs', cupolaHolderLogs);
app.use('/api/v1/process-records', processLogs); // Changed to match frontend expectations

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

// Start Server with error handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log(`💡 Try stopping the existing server or use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});