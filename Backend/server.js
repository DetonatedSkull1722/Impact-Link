import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Import API routes
import driveRoutes from './routes/driveRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json

// API Routes
app.use('/api/drives', driveRoutes);
app.use('/api/users', userRoutes);

// Basic route to check if API is running
app.get('/', (req, res) => {
  res.send('Welcome to NGO Connect API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
