// src/routes/bahan-kajian.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { bahanKajian, kurikulum, matrixCplBk, cpl } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createBahanKajianSchema, updateBahanKajianSchema, matrixCplBkSchema } from '../validators/bahan-kajian.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/bahan-kajian
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_kurikulum, aspek } = c.req.query();

  try {
    let query = db.select({
      id: bahanKajian.id,
      kode_bk: bahanKajian.kode_bk,
      nama_bahan_kajian: bahanKajian.nama_bahan_kajian,
      aspek: bahanKajian.aspek,
      ranah_keilmuan: bahanKajian.ranah_keilmuan,
      id_kurikulum: bahanKajian.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
      },
      created_at: bahanKajian.created_at,
    })
    .from(bahanKajian)
    .leftJoin(kurikulum, eq(bahanKajian.id_kurikulum, kurikulum.id));

    const conditions = [];
    if (id_kurikulum) conditions.push(eq(bahanKajian.id_kurikulum, id_kurikulum));
    if (aspek) conditions.push(eq(bahanKajian.aspek, aspek as 'S' | 'P' | 'KU' | 'KK'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query.orderBy(bahanKajian.kode_bk);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data bahan kajian'), 500);
  }
});

// GET /api/bahan-kajian/kurikulum/:id
app.get('/kurikulum/:id', async (c) => {
  const db = c.get('db');
  const kurikulumId = c.req.param('id');

  try {
    const result = await db.select()
      .from(bahanKajian)
      .where(eq(bahanKajian.id_kurikulum, kurikulumId))
      .orderBy(bahanKajian.kode_bk);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data bahan kajian'), 500);
  }
});

// GET /api/bahan-kajian/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      id: bahanKajian.id,
      kode_bk: bahanKajian.kode_bk,
      nama_bahan_kajian: bahanKajian.nama_bahan_kajian,
      aspek: bahanKajian.aspek,
      ranah_keilmuan: bahanKajian.ranah_keilmuan,
      id_kurikulum: bahanKajian.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
        tahun_berlaku: kurikulum.tahun_berlaku,
      },
      created_at: bahanKajian.created_at,
      updated_at: bahanKajian.updated_at,
    })
    .from(bahanKajian)
    .leftJoin(kurikulum, eq(bahanKajian.id_kurikulum, kurikulum.id))
    .where(eq(bahanKajian.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('Bahan kajian tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data bahan kajian'), 500);
  }
});

// POST /api/bahan-kajian
app.post('/', requireRole('admin', 'kaprodi'), zValidator('json', createBahanKajianSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(bahanKajian).values({ id, ...data });

    const result = await db.select().from(bahanKajian).where(eq(bahanKajian.id, id));
    return c.json(successResponse(result[0], 'Bahan kajian berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat bahan kajian'), 500);
  }
});

// PUT /api/bahan-kajian/:id
app.put('/:id', requireRole('admin', 'kaprodi'), zValidator('json', updateBahanKajianSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(bahanKajian)
      .set({ ...data, updated_at: new Date() })
      .where(eq(bahanKajian.id, id));

    const result = await db.select().from(bahanKajian).where(eq(bahanKajian.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('Bahan kajian tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Bahan kajian berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate bahan kajian'), 500);
  }
});

// DELETE /api/bahan-kajian/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(bahanKajian).where(eq(bahanKajian.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('Bahan kajian tidak ditemukan'), 404);
    }

    await db.delete(bahanKajian).where(eq(bahanKajian.id, id));
    return c.json(successResponse(null, 'Bahan kajian berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus bahan kajian'), 500);
  }
});

// ==================== Matrix CPL-BK ====================

// GET /api/bahan-kajian/matrix/cpl
app.get('/matrix/cpl', async (c) => {
  const db = c.get('db');
  const { id_kurikulum } = c.req.query();

  try {
    // Get all CPL
    const cplConditions = id_kurikulum ? eq(cpl.id_kurikulum, id_kurikulum) : undefined;
    const cplList = await db.select().from(cpl).where(cplConditions).orderBy(cpl.kode_cpl);

    // Get all Bahan Kajian
    const bkConditions = id_kurikulum ? eq(bahanKajian.id_kurikulum, id_kurikulum) : undefined;
    const bkList = await db.select().from(bahanKajian).where(bkConditions).orderBy(bahanKajian.kode_bk);

    // Get all mappings
    const mappings = await db.select().from(matrixCplBk);

    // Build matrix structure
    const matrix = cplList.map(cplItem => ({
      cpl: cplItem,
      mappings: bkList.map(bk => ({
        bahan_kajian: bk,
        isLinked: mappings.some(m => m.id_cpl === cplItem.id && m.id_bk === bk.id)
      }))
    }));

    return c.json(successResponse({ cplList, bkList, matrix, mappings }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil matrix CPL-BK'), 500);
  }
});

// POST /api/bahan-kajian/matrix/cpl
app.post('/matrix/cpl', requireRole('admin', 'kaprodi'), zValidator('json', matrixCplBkSchema), async (c) => {
  const db = c.get('db');
  const { mappings } = c.req.valid('json');

  try {
    // Get CPL IDs from mappings
    if (mappings.length > 0) {
      const cplIds = [...new Set(mappings.map(m => m.id_cpl))];
      
      // Clear existing mappings for these CPLs
      for (const cplId of cplIds) {
        await db.delete(matrixCplBk).where(eq(matrixCplBk.id_cpl, cplId));
      }
    }

    // Insert new mappings
    if (mappings.length > 0) {
      await db.insert(matrixCplBk).values(
        mappings.map(m => ({ id: nanoid(), ...m }))
      );
    }

    return c.json(successResponse(null, 'Matrix CPL-BK berhasil disimpan'));
  } catch (error) {
    return c.json(errorResponse('Gagal menyimpan matrix CPL-BK'), 500);
  }
});

export default app;
