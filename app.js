const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Too many login attempts. Try again later.',
  keyGenerator: (req) => req.ip,
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);

module.exports = app;
