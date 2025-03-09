// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import driveRoutes from './routes/driveRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import secureFileRoutes from './routes/secureFileRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/drives', driveRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/secure', secureFileRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to NGO Connect API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
