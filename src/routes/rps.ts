// src/routes/rps.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { rps, rpsMinggu, mataKuliah, dosen, subCpmk } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createRpsSchema, updateRpsSchema, createRpsMingguSchema, updateRpsMingguSchema, submitRpsSchema } from '../validators/rps.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/rps
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_mk, status, tahun_akademik } = c.req.query();

  try {
    let query = db.select({
      id: rps.id,
      versi: rps.versi,
      tahun_akademik: rps.tahun_akademik,
      semester_akademik: rps.semester_akademik,
      status: rps.status,
      tgl_penyusunan: rps.tgl_penyusunan,
      tgl_validasi: rps.tgl_validasi,
      id_mk: rps.id_mk,
      mata_kuliah: {
        id: mataKuliah.id,
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
        sks: mataKuliah.sks,
      },
      created_at: rps.created_at,
    })
    .from(rps)
    .leftJoin(mataKuliah, eq(rps.id_mk, mataKuliah.id));

    const conditions = [];
    if (id_mk) conditions.push(eq(rps.id_mk, id_mk));
    if (status) conditions.push(eq(rps.status, status as 'Draft' | 'Menunggu Validasi' | 'Terbit'));
    if (tahun_akademik) conditions.push(eq(rps.tahun_akademik, tahun_akademik));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const result = await query.orderBy(desc(rps.created_at));
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data RPS'), 500);
  }
});

// GET /api/rps/mata-kuliah/:id
app.get('/mata-kuliah/:id', async (c) => {
  const db = c.get('db');
  const mkId = c.req.param('id');

  try {
    const result = await db.select({
      id: rps.id,
      versi: rps.versi,
      tahun_akademik: rps.tahun_akademik,
      semester_akademik: rps.semester_akademik,
      status: rps.status,
      tgl_penyusunan: rps.tgl_penyusunan,
      tgl_validasi: rps.tgl_validasi,
      created_at: rps.created_at,
    })
    .from(rps)
    .where(eq(rps.id_mk, mkId))
    .orderBy(desc(rps.versi));

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data RPS'), 500);
  }
});

// GET /api/rps/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    // Get RPS
    const rpsResult = await db.select({
      id: rps.id,
      versi: rps.versi,
      tahun_akademik: rps.tahun_akademik,
      semester_akademik: rps.semester_akademik,
      status: rps.status,
      deskripsi_mk: rps.deskripsi_mk,
      pustaka_utama: rps.pustaka_utama,
      pustaka_pendukung: rps.pustaka_pendukung,
      tgl_penyusunan: rps.tgl_penyusunan,
      tgl_validasi: rps.tgl_validasi,
      id_mk: rps.id_mk,
      id_koordinator: rps.id_koordinator,
      id_kaprodi: rps.id_kaprodi,
      mata_kuliah: {
        id: mataKuliah.id,
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
        sks: mataKuliah.sks,
        semester: mataKuliah.semester,
      },
      created_at: rps.created_at,
      updated_at: rps.updated_at,
    })
    .from(rps)
    .leftJoin(mataKuliah, eq(rps.id_mk, mataKuliah.id))
    .where(eq(rps.id, id));

    if (rpsResult.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }

    // Get koordinator
    let koordinator = null;
    if (rpsResult[0].id_koordinator) {
      const koordinatorResult = await db.select({
        id: dosen.id,
        nama_dosen: dosen.nama_dosen,
        nip: dosen.nip,
      }).from(dosen).where(eq(dosen.id, rpsResult[0].id_koordinator));
      koordinator = koordinatorResult[0] || null;
    }

    // Get kaprodi
    let kaprodi = null;
    if (rpsResult[0].id_kaprodi) {
      const kaprodiResult = await db.select({
        id: dosen.id,
        nama_dosen: dosen.nama_dosen,
        nip: dosen.nip,
      }).from(dosen).where(eq(dosen.id, rpsResult[0].id_kaprodi));
      kaprodi = kaprodiResult[0] || null;
    }

    // Get RPS Minggu
    const mingguResult = await db.select({
      id: rpsMinggu.id,
      minggu_ke: rpsMinggu.minggu_ke,
      materi: rpsMinggu.materi,
      metode_pembelajaran: rpsMinggu.metode_pembelajaran,
      waktu_menit: rpsMinggu.waktu_menit,
      pengalaman_belajar: rpsMinggu.pengalaman_belajar,
      bentuk_penilaian: rpsMinggu.bentuk_penilaian,
      bobot_penilaian: rpsMinggu.bobot_penilaian,
      id_sub_cpmk: rpsMinggu.id_sub_cpmk,
      sub_cpmk: {
        id: subCpmk.id,
        kode_sub: subCpmk.kode_sub,
        deskripsi_sub_cpmk: subCpmk.deskripsi_sub_cpmk,
      },
    })
    .from(rpsMinggu)
    .leftJoin(subCpmk, eq(rpsMinggu.id_sub_cpmk, subCpmk.id))
    .where(eq(rpsMinggu.id_rps, id))
    .orderBy(rpsMinggu.minggu_ke);

    return c.json(successResponse({
      ...rpsResult[0],
      koordinator,
      kaprodi,
      minggu: mingguResult
    }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data RPS'), 500);
  }
});

// POST /api/rps
app.post('/', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', createRpsSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    // Get latest version for this MK
    const latestRps = await db.select({ versi: rps.versi })
      .from(rps)
      .where(eq(rps.id_mk, data.id_mk))
      .orderBy(desc(rps.versi))
      .limit(1);

    const newVersion = latestRps.length > 0 ? latestRps[0].versi + 1 : 1;

    const id = nanoid();
    await db.insert(rps).values({ 
      id, 
      ...data,
      versi: newVersion,
      tgl_penyusunan: new Date(),
    });

    const result = await db.select().from(rps).where(eq(rps.id, id));
    return c.json(successResponse(result[0], 'RPS berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat RPS'), 500);
  }
});

// PUT /api/rps/:id
app.put('/:id', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', updateRpsSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    // Check if RPS is still editable
    const existing = await db.select().from(rps).where(eq(rps.id, id));
    if (existing.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }
    if (existing[0].status === 'Terbit') {
      return c.json(errorResponse('RPS yang sudah terbit tidak dapat diubah'), 400);
    }

    await db.update(rps)
      .set({ ...data, updated_at: new Date() })
      .where(eq(rps.id, id));

    const result = await db.select().from(rps).where(eq(rps.id, id));
    return c.json(successResponse(result[0], 'RPS berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate RPS'), 500);
  }
});

// DELETE /api/rps/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(rps).where(eq(rps.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }

    await db.delete(rps).where(eq(rps.id, id));
    return c.json(successResponse(null, 'RPS berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus RPS'), 500);
  }
});

// ==================== RPS Workflow ====================

// PATCH /api/rps/:id/submit
app.patch('/:id/submit', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', submitRpsSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const { id_kaprodi } = c.req.valid('json');

  try {
    const existing = await db.select().from(rps).where(eq(rps.id, id));
    if (existing.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }
    if (existing[0].status !== 'Draft') {
      return c.json(errorResponse('Hanya RPS Draft yang dapat disubmit'), 400);
    }

    await db.update(rps)
      .set({ 
        status: 'Menunggu Validasi',
        id_kaprodi,
        updated_at: new Date()
      })
      .where(eq(rps.id, id));

    const result = await db.select().from(rps).where(eq(rps.id, id));
    return c.json(successResponse(result[0], 'RPS berhasil disubmit untuk validasi'));
  } catch (error) {
    return c.json(errorResponse('Gagal submit RPS'), 500);
  }
});

// PATCH /api/rps/:id/validate
app.patch('/:id/validate', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(rps).where(eq(rps.id, id));
    if (existing.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }
    if (existing[0].status !== 'Menunggu Validasi') {
      return c.json(errorResponse('Hanya RPS yang menunggu validasi yang dapat divalidasi'), 400);
    }

    await db.update(rps)
      .set({ 
        status: 'Terbit',
        tgl_validasi: new Date(),
        updated_at: new Date()
      })
      .where(eq(rps.id, id));

    const result = await db.select().from(rps).where(eq(rps.id, id));
    return c.json(successResponse(result[0], 'RPS berhasil divalidasi'));
  } catch (error) {
    return c.json(errorResponse('Gagal validasi RPS'), 500);
  }
});

// PATCH /api/rps/:id/reject
app.patch('/:id/reject', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(rps).where(eq(rps.id, id));
    if (existing.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }
    if (existing[0].status !== 'Menunggu Validasi') {
      return c.json(errorResponse('Hanya RPS yang menunggu validasi yang dapat ditolak'), 400);
    }

    await db.update(rps)
      .set({ 
        status: 'Draft',
        updated_at: new Date()
      })
      .where(eq(rps.id, id));

    const result = await db.select().from(rps).where(eq(rps.id, id));
    return c.json(successResponse(result[0], 'RPS ditolak dan dikembalikan ke Draft'));
  } catch (error) {
    return c.json(errorResponse('Gagal menolak RPS'), 500);
  }
});

// ==================== RPS Minggu ====================

// GET /api/rps/:id/minggu
app.get('/:id/minggu', async (c) => {
  const db = c.get('db');
  const rpsId = c.req.param('id');

  try {
    const result = await db.select({
      id: rpsMinggu.id,
      minggu_ke: rpsMinggu.minggu_ke,
      materi: rpsMinggu.materi,
      metode_pembelajaran: rpsMinggu.metode_pembelajaran,
      waktu_menit: rpsMinggu.waktu_menit,
      pengalaman_belajar: rpsMinggu.pengalaman_belajar,
      bentuk_penilaian: rpsMinggu.bentuk_penilaian,
      bobot_penilaian: rpsMinggu.bobot_penilaian,
      id_sub_cpmk: rpsMinggu.id_sub_cpmk,
      sub_cpmk: {
        id: subCpmk.id,
        kode_sub: subCpmk.kode_sub,
        deskripsi_sub_cpmk: subCpmk.deskripsi_sub_cpmk,
      },
    })
    .from(rpsMinggu)
    .leftJoin(subCpmk, eq(rpsMinggu.id_sub_cpmk, subCpmk.id))
    .where(eq(rpsMinggu.id_rps, rpsId))
    .orderBy(rpsMinggu.minggu_ke);

    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data minggu'), 500);
  }
});

// POST /api/rps/:id/minggu
app.post('/:id/minggu', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', createRpsMingguSchema), async (c) => {
  const db = c.get('db');
  const rpsId = c.req.param('id');
  const data = c.req.valid('json');

  try {
    // Check if RPS exists and is editable
    const rpsExist = await db.select().from(rps).where(eq(rps.id, rpsId));
    if (rpsExist.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }
    if (rpsExist[0].status === 'Terbit') {
      return c.json(errorResponse('RPS yang sudah terbit tidak dapat diubah'), 400);
    }

    const id = nanoid();
    await db.insert(rpsMinggu).values({ id, id_rps: rpsId, ...data });

    const result = await db.select().from(rpsMinggu).where(eq(rpsMinggu.id, id));
    return c.json(successResponse(result[0], 'Minggu berhasil ditambahkan'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal menambahkan minggu'), 500);
  }
});

// PUT /api/rps/:id/minggu/:mingguId
app.put('/:id/minggu/:mingguId', requireRole('admin', 'kaprodi', 'dosen'), zValidator('json', updateRpsMingguSchema), async (c) => {
  const db = c.get('db');
  const rpsId = c.req.param('id');
  const mingguId = c.req.param('mingguId');
  const data = c.req.valid('json');

  try {
    // Check if RPS is editable
    const rpsExist = await db.select().from(rps).where(eq(rps.id, rpsId));
    if (rpsExist.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }
    if (rpsExist[0].status === 'Terbit') {
      return c.json(errorResponse('RPS yang sudah terbit tidak dapat diubah'), 400);
    }

    await db.update(rpsMinggu)
      .set({ ...data, updated_at: new Date() })
      .where(eq(rpsMinggu.id, mingguId));

    const result = await db.select().from(rpsMinggu).where(eq(rpsMinggu.id, mingguId));
    
    if (result.length === 0) {
      return c.json(errorResponse('Minggu tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Minggu berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate minggu'), 500);
  }
});

// DELETE /api/rps/:id/minggu/:mingguId
app.delete('/:id/minggu/:mingguId', requireRole('admin', 'kaprodi', 'dosen'), async (c) => {
  const db = c.get('db');
  const rpsId = c.req.param('id');
  const mingguId = c.req.param('mingguId');

  try {
    // Check if RPS is editable
    const rpsExist = await db.select().from(rps).where(eq(rps.id, rpsId));
    if (rpsExist.length === 0) {
      return c.json(errorResponse('RPS tidak ditemukan'), 404);
    }
    if (rpsExist[0].status === 'Terbit') {
      return c.json(errorResponse('RPS yang sudah terbit tidak dapat diubah'), 400);
    }

    const existing = await db.select().from(rpsMinggu).where(eq(rpsMinggu.id, mingguId));
    if (existing.length === 0) {
      return c.json(errorResponse('Minggu tidak ditemukan'), 404);
    }

    await db.delete(rpsMinggu).where(eq(rpsMinggu.id, mingguId));
    return c.json(successResponse(null, 'Minggu berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus minggu'), 500);
  }
});

export default app;
