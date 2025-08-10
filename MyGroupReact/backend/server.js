const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const groupRoutes = require('./routes/groups');
const geographicRoutes = require('./routes/geographic');
const laborRoutes = require('./routes/labor');
const needyRoutes = require('./routes/needy');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/geographic', geographicRoutes);
app.use('/api/labor', laborRoutes);
app.use('/api/needy', needyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', require('./routes/admin'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});