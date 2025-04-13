import express from 'express';
import { createShortUrl } from '../controllers/urlController.js';

const router = express.Router();

// POST /api/url/shorten
router.post('/shorten', createShortUrl);

export default router;
