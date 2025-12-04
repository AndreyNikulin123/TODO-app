import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import folderRoutes from './routes/folder.routes';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

if (process.env.ENABLE_AUTH === 'true') {
  app.use('/api/auth', authRoutes);
}

app.use('/api/folders', folderRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(
    `🔐 Authentication: ${process.env.ENABLE_AUTH === 'true' ? 'Enabled' : 'Disabled'}`,
  );
});
