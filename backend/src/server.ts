import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import folderRoutes from './routes/folder.routes';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './swagger/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  if (req.path.startsWith('/docs')) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: cdn.jsdelivr.net;",
    );
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

if (process.env.ENABLE_AUTH === 'true') {
  app.use('/api/auth', authRoutes);
}

app.use('/api/folders', folderRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(
    `🔐 Authentication: ${process.env.ENABLE_AUTH === 'true' ? 'Enabled' : 'Disabled'}`,
  );
});
