import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/ormconfig';
import contactRoutes from './routes/contact.routes';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());
app.use(cors()); // Allow all origins, or configure as needed
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: 'Too many requests, please try again later.'
}));

// Register contact routes
app.use('/contacts', contactRoutes);

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err: any) => {
    console.error('Database connection error:', err);
  });

export default app;
