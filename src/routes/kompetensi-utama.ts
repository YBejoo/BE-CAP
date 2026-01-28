// src/routes/kompetensi-utama.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { kompetensiUtama, kurikulum } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createKompetensiUtamaSchema, updateKompetensiUtamaSchema } from '../validators/kompetensi-utama.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/kul
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_kurikulum, aspek } = c.req.query();

  try {
    let query = db.select({
      id: kompetensiUtama.id,
      kode_kul: kompetensiUtama.kode_kul,
      kompetensi_lulusan: kompetensiUtama.kompetensi_lulusan,
      aspek: kompetensiUtama.aspek,
      id_kurikulum: kompetensiUtama.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
      },
      created_at: kompetensiUtama.created_at,
    })
    .from(kompetensiUtama)
    .leftJoin(kurikulum, eq(kompetensiUtama.id_kurikulum, kurikulum.id));

    const conditions = [];
    if (id_kurikulum) conditions.push(eq(kompetensiUtama.id_kurikulum, id_kurikulum));
    if (aspek) conditions.push(eq(kompetensiUtama.aspek, aspek as 'S' | 'P' | 'KU' | 'KK'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query.orderBy(kompetensiUtama.aspek, kompetensiUtama.kode_kul);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data KUL'), 500);
  }
});

// GET /api/kul/kurikulum/:id
app.get('/kurikulum/:id', async (c) => {
  const db = c.get('db');
  const kurikulumId = c.req.param('id');

  try {
    const result = await db.select()
      .from(kompetensiUtama)
      .where(eq(kompetensiUtama.id_kurikulum, kurikulumId))
      .orderBy(kompetensiUtama.aspek, kompetensiUtama.kode_kul);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data KUL'), 500);
  }
});

// GET /api/kul/aspek/:aspek
app.get('/aspek/:aspek', async (c) => {
  const db = c.get('db');
  const aspek = c.req.param('aspek') as 'S' | 'P' | 'KU' | 'KK';
  const { id_kurikulum } = c.req.query();

  try {
    const conditions = [eq(kompetensiUtama.aspek, aspek)];
    if (id_kurikulum) conditions.push(eq(kompetensiUtama.id_kurikulum, id_kurikulum));

    const result = await db.select()
      .from(kompetensiUtama)
      .where(and(...conditions))
      .orderBy(kompetensiUtama.kode_kul);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data KUL'), 500);
  }
});

// GET /api/kul/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      id: kompetensiUtama.id,
      kode_kul: kompetensiUtama.kode_kul,
      kompetensi_lulusan: kompetensiUtama.kompetensi_lulusan,
      aspek: kompetensiUtama.aspek,
      id_kurikulum: kompetensiUtama.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
        tahun_berlaku: kurikulum.tahun_berlaku,
      },
      created_at: kompetensiUtama.created_at,
      updated_at: kompetensiUtama.updated_at,
    })
    .from(kompetensiUtama)
    .leftJoin(kurikulum, eq(kompetensiUtama.id_kurikulum, kurikulum.id))
    .where(eq(kompetensiUtama.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('KUL tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data KUL'), 500);
  }
});

// POST /api/kul
app.post('/', requireRole('admin', 'kaprodi'), zValidator('json', createKompetensiUtamaSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(kompetensiUtama).values({ id, ...data });

    const result = await db.select().from(kompetensiUtama).where(eq(kompetensiUtama.id, id));
    return c.json(successResponse(result[0], 'KUL berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat KUL'), 500);
  }
});

// PUT /api/kul/:id
app.put('/:id', requireRole('admin', 'kaprodi'), zValidator('json', updateKompetensiUtamaSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(kompetensiUtama)
      .set({ ...data, updated_at: new Date() })
      .where(eq(kompetensiUtama.id, id));

    const result = await db.select().from(kompetensiUtama).where(eq(kompetensiUtama.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('KUL tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'KUL berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate KUL'), 500);
  }
});

// DELETE /api/kul/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(kompetensiUtama).where(eq(kompetensiUtama.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('KUL tidak ditemukan'), 404);
    }

    await db.delete(kompetensiUtama).where(eq(kompetensiUtama.id, id));
    return c.json(successResponse(null, 'KUL berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus KUL'), 500);
  }
});

export default app;
