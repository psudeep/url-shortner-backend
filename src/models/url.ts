import { ObjectId } from 'mongodb';

export interface IURL {
  _id?: ObjectId;
  longUrl: string;
  shortCode: string;
  createdAt: Date;
  expirationDate: Date;
  clicks: number;
}

export class URL implements IURL {
  _id?: ObjectId;
  longUrl: string;
  shortCode: string;
  createdAt: Date;
  expirationDate: Date;
  clicks: number;

  constructor(data: Omit<IURL, '_id' | 'createdAt' | 'clicks'>) {
    this.longUrl = data.longUrl;
    this.shortCode = data.shortCode;
    this.createdAt = new Date();
    this.expirationDate = data.expirationDate;
    this.clicks = 0;
  }

  // You can add methods here if needed, for example:
  incrementClicks(): void {
    this.clicks += 1;
  }

  isExpired(): boolean {
    return new Date() > this.expirationDate;
  }
}

// Factory function to create URL instances from database results
export function createURLFromDB(data: any): URL {
  const url = new URL({
    longUrl: data.longUrl,
    shortCode: data.shortCode,
    expirationDate: new Date(data.expirationDate),
  });
  url._id = data._id;
  url.createdAt = new Date(data.createdAt);
  url.clicks = data.clicks;
  return url;
}