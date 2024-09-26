import express from 'express';
import { URLController } from '../controllers/urlController';

const router = express.Router();
const urlController = new URLController();

router.post('/shorten', urlController.shortenURL);
router.get('/:shortCode', urlController.redirectToLongURL);

export const urlRoutes = router;