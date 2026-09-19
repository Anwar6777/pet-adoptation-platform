import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDatabase from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adoptionRoutes from './routes/adoptionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import petRoutes from './routes/petRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_request, response) => {
  response.status(200).json({ message: 'PawConnect API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.MONGODB_URI) {
  connectDatabase().then(() => {
    app.listen(port, () => console.log(`PawConnect API listening on port ${port}`));
  });
} else {
  app.listen(port, () => console.log(`PawConnect API listening on port ${port} (database not configured)`));
}
