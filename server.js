import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import urlRoutes from './routes/urlRoutes.js';
import Url from './models/Url.js';
import authRoutes from './routes/authRoutes.js';
import ClickLog from './models/ClickLog.js';
import connectToDatabase from './db.js';
import useragent from 'express-useragent';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(useragent.express());

// API Routes
app.use('/api/url', urlRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Backend URL Shortener API is running! 🎉");
});

// Public redirect route (for short links)
app.get('/:alias', async (req, res) => {
  try {
    const { alias } = req.params;
    const url = await Url.findOne({ alias });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Optional: Check for expiration
    if (url.expirationDate && new Date() > url.expirationDate) {
      return res.status(410).json({ error: 'This link has expired' });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    // Log click details
    const log = new ClickLog({
      alias: alias,
      ipAddress: req.ip,
      deviceType: req.useragent.isMobile ? 'Mobile' : 'Desktop'
    });
    await log.save();

    // Redirect to the original URL
    return res.redirect(url.originalUrl);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Fetch all URLs
app.get('/api/url/all', async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching URLs' });
  }
});

// Fetch logs for specific alias
app.get('/api/logs/:alias', async (req, res) => {
  try {
    const logs = await ClickLog.find({ alias: req.params.alias });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

// Fetch all click logs
app.get('/api/clicklogs', async (req, res) => {
  try {
    const logs = await ClickLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch click logs' });
  }
});

// Connect MongoDB and start server
connectToDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error);
});
