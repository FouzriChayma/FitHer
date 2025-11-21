import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FitHer AI Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FitHer AI Backend running on http://localhost:${PORT}`);
});

