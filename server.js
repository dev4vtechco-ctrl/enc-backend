const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs-extra');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ministryRoutes = require('./routes/ministryRoutes');
const storyRoutes = require('./routes/storyRoutes');
const weeklyHighlightRoutes = require('./routes/weeklyHighlightRoutes');
const serviceLinkRoutes = require('./routes/serviceLinkRoutes');

dotenv.config();

const createUploadFolders = async () => {
  const folders = [
    'uploads',
    'uploads/events',
    'uploads/ministries',
    'uploads/stories',
    'uploads/weekly-highlights'
  ];
  
  for (const folder of folders) {
    await fs.ensureDir(path.join(__dirname, folder));
  }
  console.log('Upload folders ready');
};

// Wrap startup in an async function
const startServer = async () => {
  await connectDB();
  await createUploadFolders();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/ministries', ministryRoutes);
  app.use('/api/stories', storyRoutes);
  app.use('/api/weekly-highlights', weeklyHighlightRoutes);
  app.use('/api/service-link', serviceLinkRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running', status: 'OK' });
  });

  // Error handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("When it runs show this message and i will be happy");
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});