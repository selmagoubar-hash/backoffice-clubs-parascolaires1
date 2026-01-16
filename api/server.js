const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

require('./config/db');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5172',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/test', (req, res) => {
  res.json({ message: 'API OK ✅' });
});

const authRoutes = require('./routes/authRoutes');
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes');
const memberRoutes = require('./routes/memberRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
