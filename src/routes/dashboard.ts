// src/routes/dashboard.ts
import { Hono } from 'hono';
import { eq, count, sql } from 'drizzle-orm';

import { 
  kurikulum, 
  profilLulusan, 
  kompetensiUtama, 
  cpl, 
  bahanKajian, 
  mataKuliah, 
  dosen, 
  cpmk, 
  rps,
  penugasanDosen,
  matrixCplPl,
  matrixCplBk,
  matrixCplMk
} from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/dashboard
app.get('/', async (c) => {
  const db = c.get('db');
  const { id_kurikulum } = c.req.query();

  try {
    // Get active kurikulum if not specified
    let selectedKurikulum = id_kurikulum;
    
    if (!selectedKurikulum) {
      const activeKurikulum = await db.select()
        .from(kurikulum)
        .where(eq(kurikulum.is_active, true))
        .limit(1);
      
      if (activeKurikulum.length > 0) {
        selectedKurikulum = activeKurikulum[0].id;
      }
    }

    // Base filters
    const kurikulumFilter = selectedKurikulum ? eq(kurikulum.id, selectedKurikulum) : undefined;

    // Count total entities
    const totalKurikulum = await db.select({ count: count() }).from(kurikulum);
    
    const totalProfilLulusan = selectedKurikulum
      ? await db.select({ count: count() }).from(profilLulusan).where(eq(profilLulusan.id_kurikulum, selectedKurikulum))
      : await db.select({ count: count() }).from(profilLulusan);
    
    const totalKompetensiUtama = selectedKurikulum
      ? await db.select({ count: count() }).from(kompetensiUtama).where(eq(kompetensiUtama.id_kurikulum, selectedKurikulum))
      : await db.select({ count: count() }).from(kompetensiUtama);
    
    const totalCpl = selectedKurikulum
      ? await db.select({ count: count() }).from(cpl).where(eq(cpl.id_kurikulum, selectedKurikulum))
      : await db.select({ count: count() }).from(cpl);
    
    const totalBahanKajian = selectedKurikulum
      ? await db.select({ count: count() }).from(bahanKajian).where(eq(bahanKajian.id_kurikulum, selectedKurikulum))
      : await db.select({ count: count() }).from(bahanKajian);
    
    const totalMataKuliah = selectedKurikulum
      ? await db.select({ count: count() }).from(mataKuliah).where(eq(mataKuliah.id_kurikulum, selectedKurikulum))
      : await db.select({ count: count() }).from(mataKuliah);
    
    const totalDosen = await db.select({ count: count() }).from(dosen);
    
    const totalCpmk = await db.select({ count: count() }).from(cpmk);
    
    const totalRps = await db.select({ count: count() }).from(rps);

    // Statistics by Aspek
    const cplByAspek = await db.select({
      aspek: cpl.aspek,
      count: count()
    })
    .from(cpl)
    .where(selectedKurikulum ? eq(cpl.id_kurikulum, selectedKurikulum) : undefined)
    .groupBy(cpl.aspek);

    const kulByAspek = await db.select({
      aspek: kompetensiUtama.aspek,
      count: count()
    })
    .from(kompetensiUtama)
    .where(selectedKurikulum ? eq(kompetensiUtama.id_kurikulum, selectedKurikulum) : undefined)
    .groupBy(kompetensiUtama.aspek);

    const bkByAspek = await db.select({
      aspek: bahanKajian.aspek,
      count: count()
    })
    .from(bahanKajian)
    .where(selectedKurikulum ? eq(bahanKajian.id_kurikulum, selectedKurikulum) : undefined)
    .groupBy(bahanKajian.aspek);

    // Mata Kuliah statistics
    const mkBySemester = await db.select({
      semester: mataKuliah.semester,
      count: count()
    })
    .from(mataKuliah)
    .where(selectedKurikulum ? eq(mataKuliah.id_kurikulum, selectedKurikulum) : undefined)
    .groupBy(mataKuliah.semester)
    .orderBy(mataKuliah.semester);

    const mkBySifat = await db.select({
      sifat: mataKuliah.sifat,
      count: count()
    })
    .from(mataKuliah)
    .where(selectedKurikulum ? eq(mataKuliah.id_kurikulum, selectedKurikulum) : undefined)
    .groupBy(mataKuliah.sifat);

    // Total SKS
    const totalSKS = await db.select({
      total: sql<number>`COALESCE(SUM(${mataKuliah.sks}), 0)`
    })
    .from(mataKuliah)
    .where(selectedKurikulum ? eq(mataKuliah.id_kurikulum, selectedKurikulum) : undefined);

    // RPS status statistics
    const rpsByStatus = await db.select({
      status: rps.status,
      count: count()
    })
    .from(rps)
    .groupBy(rps.status);

    // Matrix statistics
    const totalMatrixCplPl = await db.select({ count: count() }).from(matrixCplPl);
    const totalMatrixCplBk = await db.select({ count: count() }).from(matrixCplBk);
    const totalMatrixCplMk = await db.select({ count: count() }).from(matrixCplMk);

    // Dosen statistics
    const dosenByJabatan = await db.select({
      jabatan_fungsional: dosen.jabatan_fungsional,
      count: count()
    })
    .from(dosen)
    .groupBy(dosen.jabatan_fungsional);

    // Response
    return c.json(successResponse({
      kurikulum: {
        total: totalKurikulum[0].count,
        selected_id: selectedKurikulum,
      },
      summary: {
        total_profil_lulusan: totalProfilLulusan[0].count,
        total_kompetensi_utama: totalKompetensiUtama[0].count,
        total_cpl: totalCpl[0].count,
        total_bahan_kajian: totalBahanKajian[0].count,
        total_mata_kuliah: totalMataKuliah[0].count,
        total_dosen: totalDosen[0].count,
        total_cpmk: totalCpmk[0].count,
        total_rps: totalRps[0].count,
        total_sks: Number(totalSKS[0].total),
      },
      statistics: {
        cpl_by_aspek: cplByAspek.reduce((acc, item) => {
          acc[item.aspek] = item.count;
          return acc;
        }, {} as Record<string, number>),
        kul_by_aspek: kulByAspek.reduce((acc, item) => {
          acc[item.aspek] = item.count;
          return acc;
        }, {} as Record<string, number>),
        bk_by_aspek: bkByAspek.reduce((acc, item) => {
          acc[item.aspek] = item.count;
          return acc;
        }, {} as Record<string, number>),
        mk_by_semester: mkBySemester.map(item => ({
          semester: item.semester,
          count: item.count
        })),
        mk_by_sifat: mkBySifat.reduce((acc, item) => {
          acc[item.sifat] = item.count;
          return acc;
        }, {} as Record<string, number>),
        rps_by_status: rpsByStatus.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {} as Record<string, number>),
        dosen_by_jabatan: dosenByJabatan.reduce((acc, item) => {
          acc[item.jabatan_fungsional || 'Unknown'] = item.count;
          return acc;
        }, {} as Record<string, number>),
      },
      matrix: {
        total_cpl_pl: totalMatrixCplPl[0].count,
        total_cpl_bk: totalMatrixCplBk[0].count,
        total_cpl_mk: totalMatrixCplMk[0].count,
      }
    }));
  } catch (error) {
    console.error('Dashboard error:', error);
    return c.json(errorResponse('Gagal mengambil data dashboard'), 500);
  }
});

// GET /api/dashboard/recent - Recent activities
app.get('/recent', async (c) => {
  const db = c.get('db');
  const { limit = '10' } = c.req.query();
  const limitNum = parseInt(limit);

  try {
    // Get recent RPS
    const recentRps = await db.select({
      id: rps.id,
      status: rps.status,
      tahun_akademik: rps.tahun_akademik,
      semester_akademik: rps.semester_akademik,
      created_at: rps.created_at,
      updated_at: rps.updated_at,
      mata_kuliah: {
        id: mataKuliah.id,
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
      }
    })
    .from(rps)
    .leftJoin(mataKuliah, eq(rps.id_mk, mataKuliah.id))
    .orderBy(sql`${rps.updated_at} DESC`)
    .limit(limitNum);

    // Get recent mata kuliah
    const recentMataKuliah = await db.select({
      id: mataKuliah.id,
      kode_mk: mataKuliah.kode_mk,
      nama_mk: mataKuliah.nama_mk,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      created_at: mataKuliah.created_at,
    })
    .from(mataKuliah)
    .orderBy(sql`${mataKuliah.created_at} DESC`)
    .limit(limitNum);

    return c.json(successResponse({
      recent_rps: recentRps,
      recent_mata_kuliah: recentMataKuliah,
    }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data aktivitas terbaru'), 500);
  }
});

export default app;
