import shortid from 'shortid';
import Url from '../models/Url.js'; // Your URL model for saving to MongoDB

// Create a shortened URL
export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expirationDate, userId } = req.body;

    // Generate a custom alias or a unique ID
    const alias = customAlias || shortid.generate();

    // Create a new URL document
    const newUrl = new Url({
      originalUrl,
      shortUrl: `http://localhost:5000/${alias}`,  // Replace with your domain
      alias,
      expirationDate,
      userId
    });

    // Save to the database
    await newUrl.save();

    // Respond with the shortened URL
    res.status(201).json({ shortUrl: newUrl.shortUrl });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
