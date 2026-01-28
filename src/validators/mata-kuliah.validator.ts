// src/validators/mata-kuliah.validator.ts
import { z } from 'zod';

export const createMataKuliahSchema = z.object({
  kode_mk: z.string().min(1, 'Kode MK wajib diisi'),
  nama_mk: z.string().min(1, 'Nama MK wajib diisi'),
  sks: z.number().int().min(1).max(6),
  semester: z.number().int().min(1).max(8),
  sifat: z.enum(['Wajib', 'Pilihan']),
  deskripsi: z.string().optional(),
  id_kurikulum: z.string().min(1, 'Kurikulum wajib dipilih'),
  id_bahan_kajian: z.string().optional(),
});

export const updateMataKuliahSchema = createMataKuliahSchema.partial().omit({ id_kurikulum: true });

// Matrix CPL-MK
export const matrixCplMkSchema = z.object({
  mappings: z.array(z.object({
    id_cpl: z.string(),
    id_mk: z.string(),
  })),
});

// Penugasan Dosen
export const penugasanDosenSchema = z.object({
  dosen_ids: z.array(z.string()).min(1, 'Minimal 1 dosen'),
  tahun_akademik: z.string().regex(/^\d{4}\/\d{4}$/, 'Format: 2024/2025'),
  semester_akademik: z.enum(['Ganjil', 'Genap']),
  koordinator_id: z.string().optional(),
});

export type CreateMataKuliahInput = z.infer<typeof createMataKuliahSchema>;
export type UpdateMataKuliahInput = z.infer<typeof updateMataKuliahSchema>;
export type MatrixCplMkInput = z.infer<typeof matrixCplMkSchema>;
export type PenugasanDosenInput = z.infer<typeof penugasanDosenSchema>;
