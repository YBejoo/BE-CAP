// src/routes/cpl.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { cpl, kurikulum, matrixCplPl, profilLulusan } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createCplSchema, updateCplSchema, matrixCplPlSchema } from '../validators/cpl.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/cpl
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_kurikulum, aspek, enrich } = c.req.query();

  try {
    let query = db.select({
      id: cpl.id,
      kode_cpl: cpl.kode_cpl,
      deskripsi_cpl: cpl.deskripsi_cpl,
      aspek: cpl.aspek,
      id_kurikulum: cpl.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
      },
      created_at: cpl.created_at,
    })
    .from(cpl)
    .leftJoin(kurikulum, eq(cpl.id_kurikulum, kurikulum.id));

    const conditions = [];
    if (id_kurikulum) conditions.push(eq(cpl.id_kurikulum, id_kurikulum));
    if (aspek) conditions.push(eq(cpl.aspek, aspek as 'S' | 'P' | 'KU' | 'KK'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query.orderBy(cpl.aspek, cpl.kode_cpl);
    
    // Enrich with profil_list if requested
    if (enrich === 'true' || enrich === 'profil') {
      const enrichedResult = await Promise.all(result.map(async (cplItem) => {
        // Get profil list from matrix
        const matrixItems = await db.select({
          profil: {
            id: profilLulusan.id,
            kode_profil: profilLulusan.kode_profil,
            profil_lulusan: profilLulusan.profil_lulusan,
            deskripsi: profilLulusan.deskripsi,
          }
        })
        .from(matrixCplPl)
        .innerJoin(profilLulusan, eq(matrixCplPl.id_profil, profilLulusan.id))
        .where(eq(matrixCplPl.id_cpl, cplItem.id));
        
        return {
          ...cplItem,
          profil_list: matrixItems.map(m => m.profil)
        };
      }));
      
      return c.json(successResponse(enrichedResult));
    }
    
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data CPL'), 500);
  }
});

// GET /api/cpl/kurikulum/:id
app.get('/kurikulum/:id', async (c) => {
  const db = c.get('db');
  const kurikulumId = c.req.param('id');

  try {
    const result = await db.select()
      .from(cpl)
      .where(eq(cpl.id_kurikulum, kurikulumId))
      .orderBy(cpl.aspek, cpl.kode_cpl);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data CPL'), 500);
  }
});

// GET /api/cpl/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      id: cpl.id,
      kode_cpl: cpl.kode_cpl,
      deskripsi_cpl: cpl.deskripsi_cpl,
      aspek: cpl.aspek,
      id_kurikulum: cpl.id_kurikulum,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
        tahun_berlaku: kurikulum.tahun_berlaku,
      },
      created_at: cpl.created_at,
      updated_at: cpl.updated_at,
    })
    .from(cpl)
    .leftJoin(kurikulum, eq(cpl.id_kurikulum, kurikulum.id))
    .where(eq(cpl.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('CPL tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data CPL'), 500);
  }
});

// POST /api/cpl
app.post('/', requireRole('admin', 'kaprodi'), zValidator('json', createCplSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(cpl).values({ id, ...data });

    const result = await db.select().from(cpl).where(eq(cpl.id, id));
    return c.json(successResponse(result[0], 'CPL berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat CPL'), 500);
  }
});

// PUT /api/cpl/:id
app.put('/:id', requireRole('admin', 'kaprodi'), zValidator('json', updateCplSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(cpl)
      .set({ ...data, updated_at: new Date() })
      .where(eq(cpl.id, id));

    const result = await db.select().from(cpl).where(eq(cpl.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('CPL tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'CPL berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate CPL'), 500);
  }
});

// DELETE /api/cpl/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(cpl).where(eq(cpl.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('CPL tidak ditemukan'), 404);
    }

    await db.delete(cpl).where(eq(cpl.id, id));
    return c.json(successResponse(null, 'CPL berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus CPL'), 500);
  }
});

// ==================== Matrix CPL-PL ====================

// GET /api/cpl/matrix/pl
app.get('/matrix/pl', async (c) => {
  const db = c.get('db');
  const { id_kurikulum } = c.req.query();

  try {
    // Get all CPL
    const conditions = id_kurikulum ? eq(cpl.id_kurikulum, id_kurikulum) : undefined;
    const cplList = await db.select().from(cpl).where(conditions).orderBy(cpl.kode_cpl);

    // Get all Profil Lulusan
    const plConditions = id_kurikulum ? eq(profilLulusan.id_kurikulum, id_kurikulum) : undefined;
    const plList = await db.select().from(profilLulusan).where(plConditions).orderBy(profilLulusan.kode_profil);

    // Get all mappings
    const mappings = await db.select().from(matrixCplPl);

    // Build matrix structure
    const matrix = cplList.map(cplItem => ({
      cpl: cplItem,
      mappings: plList.map(pl => ({
        profil_lulusan: pl,
        isLinked: mappings.some(m => m.id_cpl === cplItem.id && m.id_profil === pl.id)
      }))
    }));

    return c.json(successResponse({ cplList, plList, matrix, mappings }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil matrix CPL-PL'), 500);
  }
});

// POST /api/cpl/matrix/pl
app.post('/matrix/pl', requireRole('admin', 'kaprodi'), zValidator('json', matrixCplPlSchema), async (c) => {
  const db = c.get('db');
  const { mappings } = c.req.valid('json');

  try {
    // Get CPL IDs from mappings to determine which kurikulum
    if (mappings.length > 0) {
      const cplIds = [...new Set(mappings.map(m => m.id_cpl))];
      
      // Clear existing mappings for these CPLs
      for (const cplId of cplIds) {
        await db.delete(matrixCplPl).where(eq(matrixCplPl.id_cpl, cplId));
      }
    }

    // Insert new mappings
    if (mappings.length > 0) {
      await db.insert(matrixCplPl).values(
        mappings.map(m => ({ id: nanoid(), ...m }))
      );
    }

    return c.json(successResponse(null, 'Matrix CPL-PL berhasil disimpan'));
  } catch (error) {
    return c.json(errorResponse('Gagal menyimpan matrix CPL-PL'), 500);
  }
});

export default app;
