// src/routes/mata-kuliah.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { mataKuliah, kurikulum, bahanKajian, matrixCplMk, cpl, penugasanDosen, dosen } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createMataKuliahSchema, updateMataKuliahSchema, matrixCplMkSchema, penugasanDosenSchema } from '../validators/mata-kuliah.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/mata-kuliah
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_kurikulum, semester, sifat } = c.req.query();

  try {
    let query = db.select({
      id: mataKuliah.id,
      kode_mk: mataKuliah.kode_mk,
      nama_mk: mataKuliah.nama_mk,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      sifat: mataKuliah.sifat,
      deskripsi: mataKuliah.deskripsi,
      id_kurikulum: mataKuliah.id_kurikulum,
      id_bahan_kajian: mataKuliah.id_bahan_kajian,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
      },
      bahan_kajian: {
        id: bahanKajian.id,
        kode_bk: bahanKajian.kode_bk,
        nama_bahan_kajian: bahanKajian.nama_bahan_kajian,
      },
      created_at: mataKuliah.created_at,
    })
    .from(mataKuliah)
    .leftJoin(kurikulum, eq(mataKuliah.id_kurikulum, kurikulum.id))
    .leftJoin(bahanKajian, eq(mataKuliah.id_bahan_kajian, bahanKajian.id));

    const conditions = [];
    if (id_kurikulum) conditions.push(eq(mataKuliah.id_kurikulum, id_kurikulum));
    if (semester) conditions.push(eq(mataKuliah.semester, parseInt(semester)));
    if (sifat) conditions.push(eq(mataKuliah.sifat, sifat as 'Wajib' | 'Pilihan'));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query.orderBy(mataKuliah.semester, mataKuliah.kode_mk);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data mata kuliah'), 500);
  }
});

// GET /api/mata-kuliah/kurikulum/:id
app.get('/kurikulum/:id', async (c) => {
  const db = c.get('db');
  const kurikulumId = c.req.param('id');

  try {
    const result = await db.select()
      .from(mataKuliah)
      .where(eq(mataKuliah.id_kurikulum, kurikulumId))
      .orderBy(mataKuliah.semester, mataKuliah.kode_mk);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data mata kuliah'), 500);
  }
});

// GET /api/mata-kuliah/semester/:sem
app.get('/semester/:sem', async (c) => {
  const db = c.get('db');
  const semester = parseInt(c.req.param('sem'));
  const { id_kurikulum } = c.req.query();

  try {
    const conditions = [eq(mataKuliah.semester, semester)];
    if (id_kurikulum) conditions.push(eq(mataKuliah.id_kurikulum, id_kurikulum));

    const result = await db.select()
      .from(mataKuliah)
      .where(and(...conditions))
      .orderBy(mataKuliah.kode_mk);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data mata kuliah'), 500);
  }
});

// GET /api/mata-kuliah/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      id: mataKuliah.id,
      kode_mk: mataKuliah.kode_mk,
      nama_mk: mataKuliah.nama_mk,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      sifat: mataKuliah.sifat,
      deskripsi: mataKuliah.deskripsi,
      id_kurikulum: mataKuliah.id_kurikulum,
      id_bahan_kajian: mataKuliah.id_bahan_kajian,
      kurikulum: {
        id: kurikulum.id,
        nama_kurikulum: kurikulum.nama_kurikulum,
        tahun_berlaku: kurikulum.tahun_berlaku,
      },
      bahan_kajian: {
        id: bahanKajian.id,
        kode_bk: bahanKajian.kode_bk,
        nama_bahan_kajian: bahanKajian.nama_bahan_kajian,
      },
      created_at: mataKuliah.created_at,
      updated_at: mataKuliah.updated_at,
    })
    .from(mataKuliah)
    .leftJoin(kurikulum, eq(mataKuliah.id_kurikulum, kurikulum.id))
    .leftJoin(bahanKajian, eq(mataKuliah.id_bahan_kajian, bahanKajian.id))
    .where(eq(mataKuliah.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('Mata kuliah tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data mata kuliah'), 500);
  }
});

// POST /api/mata-kuliah
app.post('/', requireRole('admin', 'kaprodi'), zValidator('json', createMataKuliahSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(mataKuliah).values({ id, ...data });

    const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(result[0], 'Mata kuliah berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat mata kuliah'), 500);
  }
});

// PUT /api/mata-kuliah/:id
app.put('/:id', requireRole('admin', 'kaprodi'), zValidator('json', updateMataKuliahSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(mataKuliah)
      .set({ ...data, updated_at: new Date() })
      .where(eq(mataKuliah.id, id));

    const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('Mata kuliah tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Mata kuliah berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate mata kuliah'), 500);
  }
});

// DELETE /api/mata-kuliah/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('Mata kuliah tidak ditemukan'), 404);
    }

    await db.delete(mataKuliah).where(eq(mataKuliah.id, id));
    return c.json(successResponse(null, 'Mata kuliah berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus mata kuliah'), 500);
  }
});

// ==================== Matrix CPL-MK ====================

// GET /api/mata-kuliah/matrix/cpl
app.get('/matrix/cpl', async (c) => {
  const db = c.get('db');
  const { id_kurikulum } = c.req.query();

  try {
    // Get all CPL
    const cplConditions = id_kurikulum ? eq(cpl.id_kurikulum, id_kurikulum) : undefined;
    const cplList = await db.select().from(cpl).where(cplConditions).orderBy(cpl.kode_cpl);

    // Get all Mata Kuliah
    const mkConditions = id_kurikulum ? eq(mataKuliah.id_kurikulum, id_kurikulum) : undefined;
    const mkList = await db.select().from(mataKuliah).where(mkConditions).orderBy(mataKuliah.semester, mataKuliah.kode_mk);

    // Get all mappings
    const mappings = await db.select().from(matrixCplMk);

    // Build matrix structure
    const matrix = cplList.map(cplItem => ({
      cpl: cplItem,
      mappings: mkList.map(mk => ({
        mata_kuliah: mk,
        isLinked: mappings.some(m => m.id_cpl === cplItem.id && m.id_mk === mk.id)
      }))
    }));

    return c.json(successResponse({ cplList, mkList, matrix, mappings }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil matrix CPL-MK'), 500);
  }
});

// POST /api/mata-kuliah/matrix/cpl
app.post('/matrix/cpl', requireRole('admin', 'kaprodi'), zValidator('json', matrixCplMkSchema), async (c) => {
  const db = c.get('db');
  const { mappings } = c.req.valid('json');

  try {
    // Get CPL IDs from mappings
    if (mappings.length > 0) {
      const cplIds = [...new Set(mappings.map(m => m.id_cpl))];
      
      // Clear existing mappings for these CPLs
      for (const cplId of cplIds) {
        await db.delete(matrixCplMk).where(eq(matrixCplMk.id_cpl, cplId));
      }
    }

    // Insert new mappings
    if (mappings.length > 0) {
      await db.insert(matrixCplMk).values(
        mappings.map(m => ({ id: nanoid(), ...m }))
      );
    }

    return c.json(successResponse(null, 'Matrix CPL-MK berhasil disimpan'));
  } catch (error) {
    return c.json(errorResponse('Gagal menyimpan matrix CPL-MK'), 500);
  }
});

// ==================== Penugasan Dosen ====================

// GET /api/mata-kuliah/:id/dosen
app.get('/:id/dosen', async (c) => {
  const db = c.get('db');
  const mkId = c.req.param('id');
  const { tahun_akademik, semester_akademik } = c.req.query();

  try {
    let query = db.select({
      id: penugasanDosen.id,
      is_koordinator: penugasanDosen.is_koordinator,
      tahun_akademik: penugasanDosen.tahun_akademik,
      semester_akademik: penugasanDosen.semester_akademik,
      dosen: {
        id: dosen.id,
        nip: dosen.nip,
        nama_dosen: dosen.nama_dosen,
        email: dosen.email,
      },
    })
    .from(penugasanDosen)
    .innerJoin(dosen, eq(penugasanDosen.id_dosen, dosen.id))
    .where(eq(penugasanDosen.id_mk, mkId));

    // Apply filters
    if (tahun_akademik) {
      query = query.where(eq(penugasanDosen.tahun_akademik, tahun_akademik)) as typeof query;
    }
    if (semester_akademik) {
      query = query.where(eq(penugasanDosen.semester_akademik, semester_akademik as 'Ganjil' | 'Genap')) as typeof query;
    }

    const result = await query;
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data dosen'), 500);
  }
});

// POST /api/mata-kuliah/:id/dosen
app.post('/:id/dosen', requireRole('admin', 'kaprodi'), zValidator('json', penugasanDosenSchema), async (c) => {
  const db = c.get('db');
  const mkId = c.req.param('id');
  const { dosen_ids, tahun_akademik, semester_akademik, koordinator_id } = c.req.valid('json');

  try {
    // Remove existing assignments for this MK and period
    await db.delete(penugasanDosen).where(
      and(
        eq(penugasanDosen.id_mk, mkId),
        eq(penugasanDosen.tahun_akademik, tahun_akademik),
        eq(penugasanDosen.semester_akademik, semester_akademik)
      )
    );

    // Insert new assignments
    if (dosen_ids.length > 0) {
      await db.insert(penugasanDosen).values(
        dosen_ids.map(dosenId => ({
          id: nanoid(),
          id_mk: mkId,
          id_dosen: dosenId,
          tahun_akademik,
          semester_akademik,
          is_koordinator: dosenId === koordinator_id
        }))
      );
    }

    return c.json(successResponse(null, 'Dosen berhasil ditugaskan'));
  } catch (error) {
    return c.json(errorResponse('Gagal menugaskan dosen'), 500);
  }
});

// DELETE /api/mata-kuliah/:id/dosen/:dosenId
app.delete('/:id/dosen/:dosenId', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const mkId = c.req.param('id');
  const dosenId = c.req.param('dosenId');
  const { tahun_akademik, semester_akademik } = c.req.query();

  try {
    const conditions = [
      eq(penugasanDosen.id_mk, mkId),
      eq(penugasanDosen.id_dosen, dosenId)
    ];
    
    if (tahun_akademik) conditions.push(eq(penugasanDosen.tahun_akademik, tahun_akademik));
    if (semester_akademik) conditions.push(eq(penugasanDosen.semester_akademik, semester_akademik as 'Ganjil' | 'Genap'));

    await db.delete(penugasanDosen).where(and(...conditions));
    return c.json(successResponse(null, 'Penugasan dosen berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus penugasan dosen'), 500);
  }
});

export default app;
