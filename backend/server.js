import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orgsRoutes from './routes/orgRoutes.js';
import encounterRoutes from './routes/encounterRoutes.js';
import payerRuleRoutes from './routes/payerRuleRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();

// Security & Performance Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(compression()); // Compresses response bodies
app.use(morgan('dev')); // Structured logging
app.set('trust proxy', 1);

// Rate Limiting (Senior Level: DDoS protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for concurrent load testing, adjust for prod
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Core Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orgs", orgsRoutes);
app.use('/api/encounters', encounterRoutes);
app.use('/api/payer-rules', payerRuleRoutes);

app.get("/health", (req, res) => { 
    res.json({ status: 'UP', timestamp: new Date() });
});

// Error Handling (Senior Level)
app.use(notFound);
app.use(errorHandler);

// Database Connect & Server Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('📦 MongoDB Connected & Scaled');
    const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // Graceful Shutdown (Senior Level: Don't drop active connections)
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
    });
  })
  .catch(err => console.log('❌ MongoDB Connection Error:', err));