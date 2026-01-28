// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { drizzle } from 'drizzle-orm/d1';

import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error-handler';
import * as schema from './db/schema';
import * as relations from './db/relations';

// Routes
import {
  authRoutes,
  prodiRoutes,
  kurikulumRoutes,
  profilLulusanRoutes,
  kompetensiUtamaRoutes,
  cplRoutes,
  bahanKajianRoutes,
  dosenRoutes,
  mataKuliahRoutes,
  cpmkRoutes,
  rpsRoutes,
  laporanRoutes,
} from './routes';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ENVIRONMENT: string;
};

type Variables = {
  db: ReturnType<typeof drizzle>;
  user: { id: string; email: string; role: string; nama: string; id_prodi?: string };
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Global Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://si-cap.vercel.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Database middleware - inject Drizzle instance
app.use('*', async (c, next) => {
  const db = drizzle(c.env.DB, { schema: { ...schema, ...relations } });
  c.set('db', db);
  await next();
});

// Error handler
app.onError(errorHandler);

// Health check
app.get('/', (c) => c.json({ 
  success: true,
  message: 'SI-CAP API v1.0 - Sistem Informasi Capaian Pembelajaran',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  endpoints: {
    auth: '/api/auth',
    prodi: '/api/prodi',
    kurikulum: '/api/kurikulum',
    profil_lulusan: '/api/profil-lulusan',
    kompetensi_utama: '/api/kul',
    cpl: '/api/cpl',
    bahan_kajian: '/api/bahan-kajian',
    dosen: '/api/dosen',
    mata_kuliah: '/api/mata-kuliah',
    cpmk: '/api/cpmk',
    rps: '/api/rps',
    laporan: '/api/laporan',
  }
}));

// Health check endpoint
app.get('/health', (c) => c.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString() 
}));

// ==================== Public Routes ====================
app.route('/api/auth', authRoutes);

// ==================== Protected Routes ====================
app.use('/api/*', authMiddleware);

// Prodi
app.route('/api/prodi', prodiRoutes);

// Kurikulum
app.route('/api/kurikulum', kurikulumRoutes);

// Profil Lulusan
app.route('/api/profil-lulusan', profilLulusanRoutes);

// Kompetensi Utama Lulusan (KUL)
app.route('/api/kul', kompetensiUtamaRoutes);

// CPL (Capaian Pembelajaran Lulusan)
app.route('/api/cpl', cplRoutes);

// Bahan Kajian
app.route('/api/bahan-kajian', bahanKajianRoutes);

// Dosen
app.route('/api/dosen', dosenRoutes);

// Mata Kuliah
app.route('/api/mata-kuliah', mataKuliahRoutes);

// CPMK (Capaian Pembelajaran Mata Kuliah)
app.route('/api/cpmk', cpmkRoutes);

// RPS (Rencana Pembelajaran Semester)
app.route('/api/rps', rpsRoutes);

// Laporan
app.route('/api/laporan', laporanRoutes);

// 404 handler
app.notFound((c) => c.json({ 
  success: false, 
  error: 'Not Found',
  message: 'The requested endpoint does not exist'
}, 404));

export default app;
