import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import kisanSetuRoutes from './routes/kisanSetu.routes';
import { checkDatabaseConnection } from './prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for API transparency
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Kisan Setu API',
    timestamp: new Date().toISOString()
  });
});

// Mount Kisan Setu API routes
app.use('/api/kisan-setu', kisanSetuRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server & Connect Database
async function bootstrap() {
  await checkDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`🌾 Kisan Setu Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/kisan-setu`);
  });
}

bootstrap();

export default app;
