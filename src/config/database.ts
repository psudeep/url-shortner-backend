import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';
import mysql from 'mysql2/promise';
// import { Pool } from 'pg';
import { DynamoDB } from 'aws-sdk';

dotenv.config();

export interface DatabaseConfig {
  type: 'mongo' | 'mysql' | 'postgres' | 'dynamo';
  url: string;
  options?: any;
}

export interface DatabaseConnection {
  client: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const dbConfig: DatabaseConfig = {
  type: (process.env.DATABASE_TYPE as 'mongo' | 'mysql' | 'postgres' | 'dynamo') || 'mongo',
  url: process.env.DATABASE_URL || 'mongodb://localhost:27017/urlshortener',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

class MongoConnection implements DatabaseConnection {
  client: MongoClient;
  db: Db | null = null;

  constructor(config: DatabaseConfig) {
    this.client = new MongoClient(config.url, config.options);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db();
    console.log('Connected to MongoDB');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }
}

class MySQLConnection implements DatabaseConnection {
  client: mysql.Pool;

  constructor(config: DatabaseConfig) {
    this.client = mysql.createPool(config.url);
  }

  async connect(): Promise<void> {
    await this.client.getConnection();
    console.log('Connected to MySQL');
  }

  async disconnect(): Promise<void> {
    await this.client.end();
    console.log('Disconnected from MySQL');
  }
}

/*
class PostgresConnection implements DatabaseConnection {
  client: Pool;

  constructor(config: DatabaseConfig) {
    this.client = new Pool({ connectionString: config.url, ...config.options });
  }

  async connect(): Promise<void> {
    await this.client.connect();
    console.log('Connected to PostgreSQL');
  }

  async disconnect(): Promise<void> {
    await this.client.end();
    console.log('Disconnected from PostgreSQL');
  }
}
*/

class DynamoConnection implements DatabaseConnection {
  client: DynamoDB.DocumentClient;

  constructor(config: DatabaseConfig) {
    this.client = new DynamoDB.DocumentClient({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async connect(): Promise<void> {
    // DynamoDB doesn't require an explicit connection
    console.log('DynamoDB client initialized');
  }

  async disconnect(): Promise<void> {
    // DynamoDB doesn't require an explicit disconnection
    console.log('DynamoDB client released');
  }
}

export function createDatabaseConnection(config: DatabaseConfig): DatabaseConnection {
  switch (config.type) {
    case 'mongo':
      return new MongoConnection(config);
    case 'mysql':
      return new MySQLConnection(config);
    case 'postgres':
    //   return new PostgresConnection(config);
    case 'dynamo':
      return new DynamoConnection(config);
    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

export const dbConnection = createDatabaseConnection(dbConfig);