require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { initSyncDaemon } = require('./services/syncDaemon');
const { seedDatabaseIfEmpty } = require('./services/seedService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/health-sync', require('./routes/healthApiRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/blood', require('./routes/bloodRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/operations', require('./routes/operationsRoutes'));

// Root & Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'MediPulse BD (স্বাস্থ্যপালস)',
    version: '1.0.0',
    mode: 'Real-time Autonomous External API Synchronization',
    timestamp: new Date()
  });
});

// Bootstrapping
const startServer = async () => {
  await connectDB();
  await seedDatabaseIfEmpty();
  initSyncDaemon();

  return app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[MediPulse BD] Healthcare Command Server Running on port ${PORT}`);
    console.log(`[MediPulse BD] Live Telemetry endpoint: http://localhost:${PORT}/api/health-sync/live-telemetry`);
    console.log(`====================================================`);
  });
};

// Initial connection for serverless / local
connectDB().then(async () => {
  await seedDatabaseIfEmpty();
  initSyncDaemon();
}).catch(err => {
  console.warn('[MediPulse BD] Boot warning:', err.message);
});

if (require.main === module) {
  startServer();
}

module.exports = app;
