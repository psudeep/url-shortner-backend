import { Request, Response, NextFunction } from 'express';
import { URLService } from '../services/urlService';
import { cacheService, CacheService } from '../services/cacheService';
import { AppError } from '../middlewares/errorHandler';

export class URLController {
  private urlService: URLService;

  constructor() {
    this.urlService = new URLService();
  }

  shortenURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { longUrl } = req.body;
      if (!longUrl) {
        throw new AppError('Long URL is required', 400);
      }
      const shortCode = await this.urlService.createShortURL(longUrl);
      res.status(201).json({ shortCode });
    } catch (error) {
      next(error);
    }
  };

  redirectToLongURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shortCode } = req.params;
      
      // Check cache first
      const cacheKey = CacheService.createShortCodeKey(shortCode);
      const cachedUrl = await cacheService.get(cacheKey);
      if (cachedUrl) {
        return res.redirect(cachedUrl);
      }

      const longUrl = await this.urlService.getLongURL(shortCode);
      if (!longUrl) {
        throw new AppError('Short URL not found', 404);
      }

      // Cache the result for future requests
      await cacheService.set(cacheKey, longUrl);

      res.redirect(longUrl);
    } catch (error) {
      next(error);
    }
  };
}