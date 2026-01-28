// src/routes/cpmk.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { cpmk, subCpmk, mataKuliah, cpl } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createCpmkSchema, updateCpmkSchema, createSubCpmkSchema, updateSubCpmkSchema } from '../validators/cpmk.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/cpmk
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_mk } = c.req.query();

  try {
    let query = db.select({
      id: cpmk.id,
      kode_cpmk: cpmk.kode_cpmk,
      deskripsi_cpmk: cpmk.deskripsi_cpmk,
      bobot_persentase: cpmk.bobot_persentase,
      id_mk: cpmk.id_mk,
      id_cpl: cpmk.id_cpl,
      mata_kuliah: {
        id: mataKuliah.id,
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
      },
      cpl: {
        id: cpl.id,
        kode_cpl: cpl.kode_cpl,
        deskripsi_cpl: cpl.deskripsi_cpl,
      },
      created_at: cpmk.created_at,
    })
    .from(cpmk)
    .leftJoin(mataKuliah, eq(cpmk.id_mk, mataKuliah.id))
    .leftJoin(cpl, eq(cpmk.id_cpl, cpl.id));

    if (id_mk) {
      query = query.where(eq(cpmk.id_mk, id_mk)) as typeof query;
    }

    const result = await query.orderBy(cpmk.kode_cpmk);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data CPMK'), 500);
  }
});

// GET /api/cpmk/mata-kuliah/:id
app.get('/mata-kuliah/:id', async (c) => {
  const db = c.get('db');
  const mkId = c.req.param('id');

  try {
    const result = await db.select({
      id: cpmk.id,
      kode_cpmk: cpmk.kode_cpmk,
      deskripsi_cpmk: cpmk.deskripsi_cpmk,
      bobot_persentase: cpmk.bobot_persentase,
      id_mk: cpmk.id_mk,
      id_cpl: cpmk.id_cpl,
      cpl: {
        id: cpl.id,
        kode_cpl: cpl.kode_cpl,
        deskripsi_cpl: cpl.deskripsi_cpl,
      },
      created_at: cpmk.created_at,
    })
    .from(cpmk)
    .leftJoin(cpl, eq(cpmk.id_cpl, cpl.id))
    .where(eq(cpmk.id_mk, mkId))
    .orderBy(cpmk.kode_cpmk);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data CPMK'), 500);
  }
});

// GET /api/cpmk/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    // Get CPMK
    const cpmkResult = await db.select({
      id: cpmk.id,
      kode_cpmk: cpmk.kode_cpmk,
      deskripsi_cpmk: cpmk.deskripsi_cpmk,
      bobot_persentase: cpmk.bobot_persentase,
      id_mk: cpmk.id_mk,
      id_cpl: cpmk.id_cpl,
      mata_kuliah: {
        id: mataKuliah.id,
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
      },
      cpl: {
        id: cpl.id,
        kode_cpl: cpl.kode_cpl,
        deskripsi_cpl: cpl.deskripsi_cpl,
      },
      created_at: cpmk.created_at,
      updated_at: cpmk.updated_at,
    })
    .from(cpmk)
    .leftJoin(mataKuliah, eq(cpmk.id_mk, mataKuliah.id))
    .leftJoin(cpl, eq(cpmk.id_cpl, cpl.id))
    .where(eq(cpmk.id, id));

    if (cpmkResult.length === 0) {
      return c.json(errorResponse('CPMK tidak ditemukan'), 404);
    }

    // Get Sub-CPMK
    const subCpmkResult = await db.select()
      .from(subCpmk)
      .where(eq(subCpmk.id_cpmk, id))
      .orderBy(subCpmk.kode_sub);

    return c.json(successResponse({
      ...cpmkResult[0],
      sub_cpmk: subCpmkResult
    }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data CPMK'), 500);
  }
});

// POST /api/cpmk
app.post('/', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', createCpmkSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(cpmk).values({ id, ...data });

    const result = await db.select().from(cpmk).where(eq(cpmk.id, id));
    return c.json(successResponse(result[0], 'CPMK berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat CPMK'), 500);
  }
});

// PUT /api/cpmk/:id
app.put('/:id', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', updateCpmkSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(cpmk)
      .set({ ...data, updated_at: new Date() })
      .where(eq(cpmk.id, id));

    const result = await db.select().from(cpmk).where(eq(cpmk.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('CPMK tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'CPMK berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate CPMK'), 500);
  }
});

// DELETE /api/cpmk/:id
app.delete('/:id', requireRole('admin', 'kaprodi', 'dosen'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(cpmk).where(eq(cpmk.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('CPMK tidak ditemukan'), 404);
    }

    await db.delete(cpmk).where(eq(cpmk.id, id));
    return c.json(successResponse(null, 'CPMK berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus CPMK'), 500);
  }
});

// ==================== Sub-CPMK ====================

// POST /api/cpmk/:id/sub
app.post('/:id/sub', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', createSubCpmkSchema), async (c) => {
  const db = c.get('db');
  const cpmkId = c.req.param('id');
  const data = c.req.valid('json');

  try {
    // Verify CPMK exists
    const cpmkExists = await db.select().from(cpmk).where(eq(cpmk.id, cpmkId));
    if (cpmkExists.length === 0) {
      return c.json(errorResponse('CPMK tidak ditemukan'), 404);
    }

    const id = nanoid();
    await db.insert(subCpmk).values({ id, id_cpmk: cpmkId, ...data });

    const result = await db.select().from(subCpmk).where(eq(subCpmk.id, id));
    return c.json(successResponse(result[0], 'Sub-CPMK berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat Sub-CPMK'), 500);
  }
});

// PUT /api/cpmk/:id/sub/:subId
app.put('/:id/sub/:subId', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', updateSubCpmkSchema), async (c) => {
  const db = c.get('db');
  const subId = c.req.param('subId');
  const data = c.req.valid('json');

  try {
    await db.update(subCpmk)
      .set({ ...data, updated_at: new Date() })
      .where(eq(subCpmk.id, subId));

    const result = await db.select().from(subCpmk).where(eq(subCpmk.id, subId));
    
    if (result.length === 0) {
      return c.json(errorResponse('Sub-CPMK tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Sub-CPMK berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate Sub-CPMK'), 500);
  }
});

// DELETE /api/cpmk/:id/sub/:subId
app.delete('/:id/sub/:subId', requireRole('admin', 'kaprodi', 'dosen'), async (c) => {
  const db = c.get('db');
  const subId = c.req.param('subId');

  try {
    const existing = await db.select().from(subCpmk).where(eq(subCpmk.id, subId));
    
    if (existing.length === 0) {
      return c.json(errorResponse('Sub-CPMK tidak ditemukan'), 404);
    }

    await db.delete(subCpmk).where(eq(subCpmk.id, subId));
    return c.json(successResponse(null, 'Sub-CPMK berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus Sub-CPMK'), 500);
  }
});

export default app;
