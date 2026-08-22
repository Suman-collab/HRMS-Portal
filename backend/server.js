import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/db.js';

// Route files
import adminRoutes from './src/routes/adminRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logger middleware
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Mount Routers
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);

// Health Check / API Root
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Dayflow HRMS Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Dayflow Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
