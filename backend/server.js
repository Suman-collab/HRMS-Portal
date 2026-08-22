import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Entry test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Dayflow Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
