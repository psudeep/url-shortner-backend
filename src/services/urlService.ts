import { URL } from '../models/url';
import { generateShortCode } from '../utils/shortCodeGenerator';
import { DatabaseFactory } from '../utils/databaseFactory';

export class URLService {
  private db: any;

  constructor() {
    this.db = DatabaseFactory.getDatabase();
  }

  async createShortURL(longUrl: string): Promise<string> {
    const shortCode = generateShortCode();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    const newUrl = new URL({
      longUrl,
      shortCode,
      expirationDate,
    });

    await this.db.save(newUrl);
    return shortCode;
  }

  async getLongURL(shortCode: string): Promise<string | null> {
    const url = await this.db.findOne({ shortCode });
    if (!url) return null;

    if (url.expirationDate < new Date()) {
      await this.db.delete(url);
      return null;
    }

    return url.longUrl;
  }

  async cleanupExpiredURLs(): Promise<void> {
    const currentDate = new Date();
    await this.db.deleteMany({ expirationDate: { $lt: currentDate } });
  }
}