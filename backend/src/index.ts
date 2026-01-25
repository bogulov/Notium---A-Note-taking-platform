import express from 'express';
import { applySecurity } from './middleware/security.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import notesRoutes from './routes/notes.routes.js';
import foldersRoutes from './routes/folders.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
applySecurity(app);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/folders', foldersRoutes);
app.use('/api/v1/ai', aiRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/v1`);
});

export default app;
