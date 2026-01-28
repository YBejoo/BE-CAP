// src/routes/profil-lulusan.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { profilLulusan, kurikulum } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createProfilLulusanSchema, updateProfilLulusanSchema } from '../validators/profil-lulusan.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/profil-lulusan
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_kurikulum } = c.req.query();

  try {
    let query = db.select({
      id: profilLulusan.id,
      kode_profil: profilLulusan.kode_profil,
      profil_lulusan: profilLulusan.profil_lulusan,
      deskripsi: profilLulusan.deskripsi,
      sumber: profilLulusan.sumber,
      id_kurikulum: profilLulusan.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
      },
      created_at: profilLulusan.created_at,
    })
    .from(profilLulusan)
    .leftJoin(kurikulum, eq(profilLulusan.id_kurikulum, kurikulum.id));

    if (id_kurikulum) {
      query = query.where(eq(profilLulusan.id_kurikulum, id_kurikulum)) as typeof query;
    }

    const result = await query.orderBy(profilLulusan.kode_profil);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data profil lulusan'), 500);
  }
});

// GET /api/profil-lulusan/kurikulum/:id
app.get('/kurikulum/:id', async (c) => {
  const db = c.get('db');
  const kurikulumId = c.req.param('id');

  try {
    const result = await db.select()
      .from(profilLulusan)
      .where(eq(profilLulusan.id_kurikulum, kurikulumId))
      .orderBy(profilLulusan.kode_profil);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data profil lulusan'), 500);
  }
});

// GET /api/profil-lulusan/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      id: profilLulusan.id,
      kode_profil: profilLulusan.kode_profil,
      profil_lulusan: profilLulusan.profil_lulusan,
      deskripsi: profilLulusan.deskripsi,
      sumber: profilLulusan.sumber,
      id_kurikulum: profilLulusan.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
        tahun_berlaku: kurikulum.tahun_berlaku,
      },
      created_at: profilLulusan.created_at,
      updated_at: profilLulusan.updated_at,
    })
    .from(profilLulusan)
    .leftJoin(kurikulum, eq(profilLulusan.id_kurikulum, kurikulum.id))
    .where(eq(profilLulusan.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('Profil lulusan tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data profil lulusan'), 500);
  }
});

// POST /api/profil-lulusan
app.post('/', requireRole('admin', 'kaprodi'), zValidator('json', createProfilLulusanSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(profilLulusan).values({ id, ...data });

    const result = await db.select().from(profilLulusan).where(eq(profilLulusan.id, id));
    return c.json(successResponse(result[0], 'Profil lulusan berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat profil lulusan'), 500);
  }
});

// PUT /api/profil-lulusan/:id
app.put('/:id', requireRole('admin', 'kaprodi'), zValidator('json', updateProfilLulusanSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(profilLulusan)
      .set({ ...data, updated_at: new Date() })
      .where(eq(profilLulusan.id, id));

    const result = await db.select().from(profilLulusan).where(eq(profilLulusan.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('Profil lulusan tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Profil lulusan berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate profil lulusan'), 500);
  }
});

// DELETE /api/profil-lulusan/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(profilLulusan).where(eq(profilLulusan.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('Profil lulusan tidak ditemukan'), 404);
    }

    await db.delete(profilLulusan).where(eq(profilLulusan.id, id));
    return c.json(successResponse(null, 'Profil lulusan berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus profil lulusan'), 500);
  }
});

export default app;
