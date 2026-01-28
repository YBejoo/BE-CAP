// src/routes/dosen.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, like, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { dosen, prodi, penugasanDosen, mataKuliah } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { createDosenSchema, updateDosenSchema } from '../validators/dosen.validator';
import { requireRole } from '../middleware/auth';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/dosen
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_prodi } = c.req.query();

  try {
    let query = db.select({
      id: dosen.id,
      nip: dosen.nip,
      nama_dosen: dosen.nama_dosen,
      email: dosen.email,
      bidang_keahlian: dosen.bidang_keahlian,
      jabatan_fungsional: dosen.jabatan_fungsional,
      id_prodi: dosen.id_prodi,
      id_user: dosen.id_user,
      prodi: {
        id: prodi.id,
        nama_prodi: prodi.nama_prodi,
      },
      created_at: dosen.created_at,
    })
    .from(dosen)
    .leftJoin(prodi, eq(dosen.id_prodi, prodi.id));

    if (id_prodi) {
      query = query.where(eq(dosen.id_prodi, id_prodi)) as typeof query;
    }

    const result = await query.orderBy(dosen.nama_dosen);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data dosen'), 500);
  }
});

// GET /api/dosen/search
app.get('/search', async (c) => {
  const db = c.get('db');
  const { q, id_prodi } = c.req.query();

  try {
    let query = db.select({
      id: dosen.id,
      nip: dosen.nip,
      nama_dosen: dosen.nama_dosen,
      email: dosen.email,
      bidang_keahlian: dosen.bidang_keahlian,
    })
    .from(dosen);

    const conditions = [];
    
    if (q) {
      conditions.push(
        or(
          like(dosen.nama_dosen, `%${q}%`),
          like(dosen.nip, `%${q}%`)
        )
      );
    }
    
    if (id_prodi) {
      conditions.push(eq(dosen.id_prodi, id_prodi));
    }

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const result = await query.orderBy(dosen.nama_dosen).limit(20);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mencari dosen'), 500);
  }
});

// GET /api/dosen/:id
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const result = await db.select({
      id: dosen.id,
      nip: dosen.nip,
      nama_dosen: dosen.nama_dosen,
      email: dosen.email,
      bidang_keahlian: dosen.bidang_keahlian,
      jabatan_fungsional: dosen.jabatan_fungsional,
      id_prodi: dosen.id_prodi,
      id_user: dosen.id_user,
      prodi: {
        id: prodi.id,
        nama_prodi: prodi.nama_prodi,
        fakultas: prodi.fakultas,
      },
      created_at: dosen.created_at,
      updated_at: dosen.updated_at,
    })
    .from(dosen)
    .leftJoin(prodi, eq(dosen.id_prodi, prodi.id))
    .where(eq(dosen.id, id));

    if (result.length === 0) {
      return c.json(errorResponse('Dosen tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data dosen'), 500);
  }
});

// GET /api/dosen/:id/mata-kuliah
app.get('/:id/mata-kuliah', async (c) => {
  const db = c.get('db');
  const dosenId = c.req.param('id');
  const { tahun_akademik, semester_akademik } = c.req.query();

  try {
    let query = db.select({
      penugasan: {
        id: penugasanDosen.id,
        is_koordinator: penugasanDosen.is_koordinator,
        tahun_akademik: penugasanDosen.tahun_akademik,
        semester_akademik: penugasanDosen.semester_akademik,
      },
      mata_kuliah: {
        id: mataKuliah.id,
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
        sks: mataKuliah.sks,
        semester: mataKuliah.semester,
      },
    })
    .from(penugasanDosen)
    .innerJoin(mataKuliah, eq(penugasanDosen.id_mk, mataKuliah.id))
    .where(eq(penugasanDosen.id_dosen, dosenId));

    // Apply filters
    if (tahun_akademik) {
      query = query.where(eq(penugasanDosen.tahun_akademik, tahun_akademik)) as typeof query;
    }
    if (semester_akademik) {
      query = query.where(eq(penugasanDosen.semester_akademik, semester_akademik as 'Ganjil' | 'Genap')) as typeof query;
    }

    const result = await query.orderBy(mataKuliah.semester, mataKuliah.kode_mk);
    return c.json(successResponse(result));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data mata kuliah'), 500);
  }
});

// POST /api/dosen
app.post('/', requireRole('admin', 'kaprodi'), zValidator('json', createDosenSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    const id = nanoid();
    await db.insert(dosen).values({ 
      id, 
      ...data,
      email: data.email || null,
    });

    const result = await db.select().from(dosen).where(eq(dosen.id, id));
    return c.json(successResponse(result[0], 'Dosen berhasil dibuat'), 201);
  } catch (error) {
    return c.json(errorResponse('Gagal membuat dosen'), 500);
  }
});

// PUT /api/dosen/:id
app.put('/:id', requireRole('admin', 'kaprodi'), zValidator('json', updateDosenSchema), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    await db.update(dosen)
      .set({ ...data, updated_at: new Date() })
      .where(eq(dosen.id, id));

    const result = await db.select().from(dosen).where(eq(dosen.id, id));
    
    if (result.length === 0) {
      return c.json(errorResponse('Dosen tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0], 'Dosen berhasil diupdate'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengupdate dosen'), 500);
  }
});

// DELETE /api/dosen/:id
app.delete('/:id', requireRole('admin', 'kaprodi'), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    const existing = await db.select().from(dosen).where(eq(dosen.id, id));
    
    if (existing.length === 0) {
      return c.json(errorResponse('Dosen tidak ditemukan'), 404);
    }

    await db.delete(dosen).where(eq(dosen.id, id));
    return c.json(successResponse(null, 'Dosen berhasil dihapus'));
  } catch (error) {
    return c.json(errorResponse('Gagal menghapus dosen'), 500);
  }
});

export default app;
