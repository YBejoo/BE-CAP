// src/routes/kurikulum.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { kurikulum, prodi } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createKurikulumSchema, updateKurikulumSchema } from '../validators/kurikulum.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/kurikulum
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_prodi, is_active } = c.req.query();

  try {
    let query = db.select({
      id: kurikulum.id,
      nama_kurikulum: kurikulum.nama_kurikulum,
      tahun_berlaku: kurikulum.tahun_berlaku,
      is_active: kurikulum.is_active,
      id_prodi: kurikulum.id_prodi,
      prodi: {
        id: prodi.id,
        nama_prodi: prodi.nama_prodi,
        kode_prodi: prodi.kode_prodi,
      },
      created_at: kurikulum.created_at,
      updated_at: kurikulum.updated_at,
    })
    .from(kurikulum)
    .leftJoin(prodi, eq(kurikulum.id_prodi, prodi.id));

    const conditions = [];
    if (id_prodi) conditions.push(eq(kurikulum.id_prodi, id_prodi));
    if (is_active === 'true') conditions.push(eq(kurikulum.is_active, true));
    if (is_active === 'false') conditions.push(eq(kurikulum.is_active, false));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query.orderBy(desc(kurikulum.tahun_berlaku));
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data kurikulum'), 500);
  }
});

// GET /api/kurikulum/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      id: kurikulum.id,
      nama_kurikulum: kurikulum.nama_kurikulum,
      tahun_berlaku: kurikulum.tahun_berlaku,
      is_active: kurikulum.is_active,
      id_prodi: kurikulum.id_prodi,
      prodi: {
        id: prodi.id,
        nama_prodi: prodi.nama_prodi,
        kode_prodi: prodi.kode_prodi,
        fakultas: prodi.fakultas,
        jenjang: prodi.jenjang,
      },
      created_at: kurikulum.created_at,
      updated_at: kurikulum.updated_at,
    })
    .from(kurikulum)
    .leftJoin(prodi, eq(kurikulum.id_prodi, prodi.id))
    .where(eq(kurikulum.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('Kurikulum tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data kurikulum'), 500);
  }
});

// POST /api/kurikulum
app.post('/', requireRole('admin', 'kaprodi'), zValidator('json', createKurikulumSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(kurikulum).values({ id, ...data });

    const result = await db.select().from(kurikulum).where(eq(kurikulum.id, id));
    return c.json(successResponse(result[0], 'Kurikulum berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat kurikulum'), 500);
  }
});

// PUT /api/kurikulum/:id
app.put('/:id', requireRole('admin', 'kaprodi'), zValidator('json', updateKurikulumSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(kurikulum)
      .set({ ...data, updated_at: new Date() })
      .where(eq(kurikulum.id, id));

    const result = await db.select().from(kurikulum).where(eq(kurikulum.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('Kurikulum tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Kurikulum berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate kurikulum'), 500);
  }
});

// DELETE /api/kurikulum/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(kurikulum).where(eq(kurikulum.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('Kurikulum tidak ditemukan'), 404);
    }

    await db.delete(kurikulum).where(eq(kurikulum.id, id));
    return c.json(successResponse(null, 'Kurikulum berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus kurikulum'), 500);
  }
});

// PATCH /api/kurikulum/:id/activate
app.patch('/:id/activate', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    // Get the kurikulum to find its prodi
    const target = await db.select().from(kurikulum).where(eq(kurikulum.id, id));
    
    if (target.length === 0) {
      return c.json(errorResponse('Kurikulum tidak ditemukan'), 404);
    }

    // Deactivate all kurikulum in the same prodi
    await db.update(kurikulum)
      .set({ is_active: false, updated_at: new Date() })
      .where(eq(kurikulum.id_prodi, target[0].id_prodi));

    // Activate the target kurikulum
    await db.update(kurikulum)
      .set({ is_active: true, updated_at: new Date() })
      .where(eq(kurikulum.id, id));

    const result = await db.select().from(kurikulum).where(eq(kurikulum.id, id));
    return c.json(successResponse(result[0], 'Kurikulum berhasil diaktifkan'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengaktifkan kurikulum'), 500);
  }
});

export default app;
