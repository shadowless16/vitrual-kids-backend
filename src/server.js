const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://virtual-kids-platform.vercel.app',
    process.env.FRONT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/results', require('./routes/results'));
app.use('/api/schools', require('./routes/schools'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/analytics', require('./routes/analytics'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
