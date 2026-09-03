import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRoutes from './server/routes.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON & URL-encoded parser (allowing image base64 uploads)
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'AgriVision AI Precision Agriculture Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // API Router Mount
  app.use('/api', apiRoutes);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriVision AI Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
