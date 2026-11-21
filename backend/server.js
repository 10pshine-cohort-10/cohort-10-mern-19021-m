require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  logger.error('MONGO_URI and JWT_SECRET must be set in .env');
  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use('/api/auth', require('./routes/authRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ err }, 'MongoDB connection failed');
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });

  /** @param {Error} err */
  server.on('error', (err) => {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  });
};

start();