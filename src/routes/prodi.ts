// src/routes/prodi.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { prodi } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createProdiSchema, updateProdiSchema } from '../validators/prodi.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/prodi
app.get('/', async (c) => {
  const db = c.get('db');

  try {
    const result = await db.select().from(prodi).orderBy(prodi.nama_prodi);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data prodi'), 500);
  }
});

// GET /api/prodi/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select().from(prodi).where(eq(prodi.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('Prodi tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data prodi'), 500);
  }
});

// POST /api/prodi (Admin only)
app.post('/', requireRole('admin'), zValidator('json', createProdiSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(prodi).values({ id, ...data });

    const result = await db.select().from(prodi).where(eq(prodi.id, id));
    return c.json(successResponse(result[0], 'Prodi berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat prodi'), 500);
  }
});

// PUT /api/prodi/:id (Admin only)
app.put('/:id', requireRole('admin'), zValidator('json', updateProdiSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(prodi)
      .set({ ...data, updated_at: new Date() })
      .where(eq(prodi.id, id));

    const result = await db.select().from(prodi).where(eq(prodi.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('Prodi tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Prodi berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate prodi'), 500);
  }
});

// DELETE /api/prodi/:id (Admin only)
app.delete('/:id', requireRole('admin'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(prodi).where(eq(prodi.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('Prodi tidak ditemukan'), 404);
    }

    await db.delete(prodi).where(eq(prodi.id, id));
    return c.json(successResponse(null, 'Prodi berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus prodi'), 500);
  }
});

export default app;
