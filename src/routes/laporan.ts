// src/routes/laporan.ts
import { Hono } from 'hono';
import { eq, sql, count } from 'drizzle-orm';

import { 
  cpl, mataKuliah, matrixCplMk, rps, penugasanDosen, dosen, kurikulum 
} from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import type { AppContext } from '../types';

const app = new Hono<AppContext>();

// GET /api/laporan/cpl-mk - Matrix CPL-MK Report
app.get('/cpl-mk', async (c) => {
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

    // Build report matrix
    const report = cplList.map(cplItem => {
      const linkedMk = mkList.filter(mk => 
        mappings.some(m => m.id_cpl === cplItem.id && m.id_mk === mk.id)
      );
      
      return {
        cpl: {
          kode: cplItem.kode_cpl,
          deskripsi: cplItem.deskripsi_cpl,
          aspek: cplItem.aspek,
        },
        jumlah_mk: linkedMk.length,
        mata_kuliah: linkedMk.map(mk => ({
          kode: mk.kode_mk,
          nama: mk.nama_mk,
          sks: mk.sks,
          semester: mk.semester,
        })),
      };
    });

    // Summary
    const summary = {
      total_cpl: cplList.length,
      total_mk: mkList.length,
      cpl_by_aspek: {
        S: cplList.filter(c => c.aspek === 'S').length,
        P: cplList.filter(c => c.aspek === 'P').length,
        KU: cplList.filter(c => c.aspek === 'KU').length,
        KK: cplList.filter(c => c.aspek === 'KK').length,
      },
    };

    return c.json(successResponse({ report, summary }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil laporan CPL-MK'), 500);
  }
});

// GET /api/laporan/rps-status - RPS Completion Status
app.get('/rps-status', async (c) => {
  const db = c.get('db');
  const { id_kurikulum, tahun_akademik } = c.req.query();

  try {
    // Get all MK
    const mkConditions = id_kurikulum ? eq(mataKuliah.id_kurikulum, id_kurikulum) : undefined;
    const mkList = await db.select().from(mataKuliah).where(mkConditions);

    // Get all RPS
    const rpsList = await db.select({
      id: rps.id,
      id_mk: rps.id_mk,
      status: rps.status,
      versi: rps.versi,
      tahun_akademik: rps.tahun_akademik,
    }).from(rps);

    // Filter by tahun_akademik if provided
    const filteredRps = tahun_akademik 
      ? rpsList.filter(r => r.tahun_akademik === tahun_akademik)
      : rpsList;

    // Build report
    const report = mkList.map(mk => {
      const mkRps = filteredRps.filter(r => r.id_mk === mk.id);
      const latestRps = mkRps.sort((a, b) => b.versi - a.versi)[0];
      
      return {
        mata_kuliah: {
          id: mk.id,
          kode: mk.kode_mk,
          nama: mk.nama_mk,
          semester: mk.semester,
        },
        has_rps: mkRps.length > 0,
        latest_status: latestRps?.status || null,
        total_versi: mkRps.length,
      };
    });

    // Summary
    const summary = {
      total_mk: mkList.length,
      mk_with_rps: report.filter(r => r.has_rps).length,
      mk_without_rps: report.filter(r => !r.has_rps).length,
      rps_by_status: {
        Draft: report.filter(r => r.latest_status === 'Draft').length,
        'Menunggu Validasi': report.filter(r => r.latest_status === 'Menunggu Validasi').length,
        Terbit: report.filter(r => r.latest_status === 'Terbit').length,
      },
      completion_rate: mkList.length > 0 
        ? Math.round((report.filter(r => r.latest_status === 'Terbit').length / mkList.length) * 100) 
        : 0,
    };

    return c.json(successResponse({ report, summary }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil laporan status RPS'), 500);
  }
});

// GET /api/laporan/mk-dosen - MK-Dosen Assignment Report
app.get('/mk-dosen', async (c) => {
  const db = c.get('db');
  const { id_kurikulum, tahun_akademik, semester_akademik } = c.req.query();

  try {
    // Get penugasan with joins
    const penugasanList = await db.select({
      id_mk: penugasanDosen.id_mk,
      id_dosen: penugasanDosen.id_dosen,
      is_koordinator: penugasanDosen.is_koordinator,
      tahun_akademik: penugasanDosen.tahun_akademik,
      semester_akademik: penugasanDosen.semester_akademik,
      mata_kuliah: {
        id: mataKuliah.id,
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
        sks: mataKuliah.sks,
        semester: mataKuliah.semester,
        id_kurikulum: mataKuliah.id_kurikulum,
      },
      dosen: {
        id: dosen.id,
        nip: dosen.nip,
        nama_dosen: dosen.nama_dosen,
      },
    })
    .from(penugasanDosen)
    .innerJoin(mataKuliah, eq(penugasanDosen.id_mk, mataKuliah.id))
    .innerJoin(dosen, eq(penugasanDosen.id_dosen, dosen.id));

    // Apply filters
    let filtered = penugasanList;
    if (id_kurikulum) {
      filtered = filtered.filter(p => p.mata_kuliah.id_kurikulum === id_kurikulum);
    }
    if (tahun_akademik) {
      filtered = filtered.filter(p => p.tahun_akademik === tahun_akademik);
    }
    if (semester_akademik) {
      filtered = filtered.filter(p => p.semester_akademik === semester_akademik);
    }

    // Group by MK
    const mkMap = new Map();
    filtered.forEach(p => {
      const key = p.id_mk;
      if (!mkMap.has(key)) {
        mkMap.set(key, {
          mata_kuliah: p.mata_kuliah,
          tahun_akademik: p.tahun_akademik,
          semester_akademik: p.semester_akademik,
          dosen_list: [],
          koordinator: null,
        });
      }
      const mk = mkMap.get(key);
      mk.dosen_list.push(p.dosen);
      if (p.is_koordinator) {
        mk.koordinator = p.dosen;
      }
    });

    const report = Array.from(mkMap.values());

    // Summary
    const uniqueDosen = new Set(filtered.map(p => p.id_dosen));
    const summary = {
      total_mk: mkMap.size,
      total_dosen: uniqueDosen.size,
      total_penugasan: filtered.length,
    };

    return c.json(successResponse({ report, summary }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil laporan MK-Dosen'), 500);
  }
});

// GET /api/laporan/cpl-progress - CPL Achievement Progress
app.get('/cpl-progress', async (c) => {
  const db = c.get('db');
  const { id_kurikulum } = c.req.query();

  try {
    // Get kurikulum info
    let kurikulumInfo = null;
    if (id_kurikulum) {
      const k = await db.select().from(kurikulum).where(eq(kurikulum.id, id_kurikulum));
      kurikulumInfo = k[0] || null;
    }

    // Get CPL with mapping counts
    const cplConditions = id_kurikulum ? eq(cpl.id_kurikulum, id_kurikulum) : undefined;
    const cplList = await db.select().from(cpl).where(cplConditions).orderBy(cpl.aspek, cpl.kode_cpl);

    // Get all mappings
    const mappings = await db.select().from(matrixCplMk);

    // Build progress report
    const report = cplList.map(cplItem => {
      const mkCount = mappings.filter(m => m.id_cpl === cplItem.id).length;
      
      return {
        cpl: {
          id: cplItem.id,
          kode: cplItem.kode_cpl,
          deskripsi: cplItem.deskripsi_cpl,
          aspek: cplItem.aspek,
        },
        jumlah_mk_terkait: mkCount,
        status: mkCount >= 2 ? 'Terpenuhi' : 'Belum Terpenuhi', // Min 2 MK per CPL
      };
    });

    // Summary by Aspek
    const summaryByAspek = ['S', 'P', 'KU', 'KK'].map(aspek => {
      const aspekCpl = report.filter(r => r.cpl.aspek === aspek);
      return {
        aspek,
        total: aspekCpl.length,
        terpenuhi: aspekCpl.filter(r => r.status === 'Terpenuhi').length,
        belum_terpenuhi: aspekCpl.filter(r => r.status === 'Belum Terpenuhi').length,
      };
    });

    const summary = {
      kurikulum: kurikulumInfo,
      total_cpl: cplList.length,
      cpl_terpenuhi: report.filter(r => r.status === 'Terpenuhi').length,
      cpl_belum_terpenuhi: report.filter(r => r.status === 'Belum Terpenuhi').length,
      completion_rate: cplList.length > 0 
        ? Math.round((report.filter(r => r.status === 'Terpenuhi').length / cplList.length) * 100)
        : 0,
      by_aspek: summaryByAspek,
    };

    return c.json(successResponse({ report, summary }));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil laporan progress CPL'), 500);
  }
});

export default app;
