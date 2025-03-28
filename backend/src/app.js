const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;