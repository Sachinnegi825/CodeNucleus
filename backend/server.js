import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orgsRoutes from './routes/orgRoutes.js';



dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true // Crucial for sending HTTP-Only cookies
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orgs",orgsRoutes)
app.get("/health", (req, res) => { 
    res.send("health check")
})

// Database Connect & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('📦 MongoDB Vector-Ready Database Connected');
    app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.log(err));