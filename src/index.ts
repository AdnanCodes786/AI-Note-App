import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRoutes from './routes/notes';
import aiRoutes from './routes/ai';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth',authRouter);

// Health check
app.get('/', (req, res) => {
  res.send('Notes API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});