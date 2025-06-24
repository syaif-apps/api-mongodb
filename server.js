require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // HANYA SATU INI

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json()); // To parse JSON bodies from requests
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to the RESTful API!');
});

// Routes for items (we will create this file next)
const itemsRouter = require('./routes/items');
app.use('/api/items', itemsRouter); // All routes in itemsRouter will be prefixed with /api/items

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}`);
});

