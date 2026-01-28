// src/validators/cpmk.validator.ts
import { z } from 'zod';

export const createCpmkSchema = z.object({
  kode_cpmk: z.string().min(1, 'Kode CPMK wajib diisi'), // CPMK-1, CPMK-2
  deskripsi_cpmk: z.string().min(1, 'Deskripsi CPMK wajib diisi'),
  bobot_persentase: z.number().min(0).max(100),
  id_mk: z.string().min(1, 'Mata kuliah wajib dipilih'),
  id_cpl: z.string().min(1, 'CPL wajib dipilih'),
});

export const updateCpmkSchema = createCpmkSchema.partial().omit({ id_mk: true });

// Sub-CPMK
export const createSubCpmkSchema = z.object({
  kode_sub: z.string().min(1, 'Kode Sub-CPMK wajib diisi'), // L1.1, L1.2
  deskripsi_sub_cpmk: z.string().min(1, 'Deskripsi Sub-CPMK wajib diisi'),
  indikator: z.string().min(1, 'Indikator wajib diisi'),
  kriteria_penilaian: z.string().min(1, 'Kriteria penilaian wajib diisi'),
});

export const updateSubCpmkSchema = createSubCpmkSchema.partial();

export type CreateCpmkInput = z.infer<typeof createCpmkSchema>;
export type UpdateCpmkInput = z.infer<typeof updateCpmkSchema>;
export type CreateSubCpmkInput = z.infer<typeof createSubCpmkSchema>;
export type UpdateSubCpmkInput = z.infer<typeof updateSubCpmkSchema>;
