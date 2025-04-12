const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const Url = require('./models/Url');
const authRoutes = require('./routes/authRoutes');
const ClickLog = require('./models/ClickLog');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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

        // Increment the click count
        url.clicks += 1;
        await url.save();

        const log = new ClickLog({
            alias: alias,
            ipAddress: req.ip, // client's IP
            deviceType: req.useragent.isMobile ? 'Mobile' : 'Desktop'
          });
        await log.save();

        // Optional: Check for expiration
        if (url.expirationDate && new Date() > url.expirationDate) {
            return res.status(410).json({ error: 'This link has expired' });
        }

        // Redirect to the original URL
        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});


app.get('/api/url/all', async (req, res) => {
    const urls = await Url.find();
    res.json(urls);
});

app.get('/api/logs/:alias', async (req, res) => {
    try {
      const logs = await ClickLog.find({ alias: req.params.alias });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching logs' });
    }
  });

  app.get('/api/clicklogs', async (req, res) => {
    try {
      const logs = await ClickLog.find().sort({ createdAt: -1 }); // latest first
      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch click logs' });
    }
  });
  

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/urlshortener', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
