import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// All Module Route Imports
import profileRoutes from './src/routes/profile.routes.js';
import aboutRoutes from './src/routes/about.routes.js';
import skillsRoutes from './src/routes/skills.routes.js';
import socialsRoutes from './src/routes/socials.routes.js';
import projectsRoutes from './src/routes/projects.routes.js';
import educationRoutes from './src/routes/education.routes.js';
import certificationsRoutes from './src/routes/certifications.routes.js';
import experienceRoutes from './src/routes/experience.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security 1: Set secure HTTP response headers
app.use(helmet());

// Security 2: Restrict CORS to trusted origins & expose x-admin-key header
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, cURL, Thunder Client)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS security policy'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-admin-key'],
    credentials: true,
  })
);

// Security 3: Rate Limiting to protect against DDoS & brute-force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});

app.use('/api', apiLimiter);

// Security 4: Restrict request payload size (prevents memory exhaustion)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Mount All API Routes
app.use('/api/profile', profileRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/socials', socialsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/experiences', experienceRoutes);

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Backend server is active & secure' });
});

// Handling 404 - Unmatched Routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Requested API route does not exist' });
});

// Security 5: Global Error Handling Middleware (prevents stack leaks in production)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Secure Server & Database Bootstrap Process
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running securely on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database connection error:', error);
    process.exit(1);
  }
};

startServer();