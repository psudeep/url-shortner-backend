import { MongoClient } from 'mongodb';
import mysql from 'mysql2/promise';
import { Pool } from 'pg';
import { DynamoDB } from 'aws-sdk';

export class DatabaseFactory {
  private static instance: any;

  static async getDatabase() {
    if (this.instance) {
      return this.instance;
    }

    const dbType = process.env.DATABASE_TYPE || 'mongo';
    const dbUrl: string = process.env.DATABASE_URL || 'mongodb://localhost:27017/urlshortener';

    switch (dbType) {
      case 'mongo':
        const client = await MongoClient.connect(dbUrl);
        this.instance = client.db();
        break;
      case 'mysql':
        this.instance = await mysql.createConnection(dbUrl);
        break;
      case 'postgres':
        this.instance = new Pool({ connectionString: dbUrl });
        break;
      case 'dynamo':
        this.instance = new DynamoDB.DocumentClient({
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        break;
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }

    return this.instance;
  }

  static async connectDatabase() {
    await this.getDatabase();
    console.log(`Connected to ${process.env.DATABASE_TYPE} database`);
  }
}

export const connectDatabase = DatabaseFactory.connectDatabase;
