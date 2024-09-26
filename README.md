# URL Shortener

A modular URL shortener service built with Node.js and TypeScript, supporting multiple databases and caching.

## Project Structure

```
url-shortener/
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── cache.ts
│   ├── controllers/
│   │   └── urlController.ts
│   ├── models/
│   │   └── url.ts
│   ├── routes/
│   │   └── urlRoutes.ts
│   ├── services/
│   │   ├── urlService.ts
│   │   └── cacheService.ts
│   ├── utils/
│   │   ├── databaseFactory.ts
│   │   └── shortCodeGenerator.ts
│   ├── middlewares/
│   │   └── errorHandler.ts
│   └── app.ts
│
├── tests/
│   └── url.test.ts
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- Shorten long URLs to unique short codes
- Support for multiple databases (MongoDB, MySQL, PostgreSQL, DynamoDB)
- Caching for faster URL redirection
- Automatic cleanup of expired short URLs (30-day expiration)
- Modular and extensible architecture

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your environment variables
4. Build the project: `npm run build`
5. Start the server: `npm start`

## Configuration

Edit the `.env` file to configure your database and cache settings:

```
PORT=3000
NODE_ENV=development
DATABASE_TYPE=mongo
DATABASE_URL=mongodb://localhost:27017/urlshortener
REDIS_URL=redis://localhost:6379
SHORT_URL_LENGTH=6
URL_EXPIRATION_DAYS=30
```

## API Endpoints

- `POST /api/shorten`: Create a new short URL
- `GET /:shortCode`: Redirect to the original URL

## Running Tests

Run the test suite with: `npm test`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.