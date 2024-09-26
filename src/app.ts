import express from 'express';
import dotenv from 'dotenv';
import { urlRoutes } from './routes/urlRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { connectDatabase } from './utils/databaseFactory';
// import { initializeCache } from './services/cacheService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', urlRoutes);

// Error handling middleware
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();
    // await initializeCache();
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;