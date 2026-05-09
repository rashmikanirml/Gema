require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const models = require('./models');
const seedDatabase = require('./config/seeder');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database connection...');
    await models.sequelize.authenticate();
    console.log('✅ Database authenticated successfully');

    // Sync models with database
    await models.sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    // Seed initial data (only if tables are empty)
    const roleCount = await models.Role.count();
    if (roleCount === 0) {
      console.log('📊 Running database seeders...');
      await seedDatabase();
    } else {
      console.log('✅ Database already seeded, skipping seeder');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Don't exit, allow server to continue (helpful for debugging)
  }
};

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Gema Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes (to be added)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/destinations', require('./routes/destinations'));
// etc.

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log(`🚀 Gema Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  
  // Initialize database after server starts
  await initializeDatabase();
});

module.exports = app;
