const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();


app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser
app.use('/uploads', express.static('uploads')); // Serve static files

// API Routes
app.use('/api/posts', postRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});