// src/validators/rps.validator.ts
import { z } from 'zod';

export const createRpsSchema = z.object({
  id_mk: z.string().min(1, 'Mata kuliah wajib dipilih'),
  tahun_akademik: z.string().regex(/^\d{4}\/\d{4}$/, 'Format: 2024/2025'),
  semester_akademik: z.enum(['Ganjil', 'Genap']),
  deskripsi_mk: z.string().optional(),
  pustaka_utama: z.string().optional(),
  pustaka_pendukung: z.string().optional(),
  id_koordinator: z.string().optional(),
});

export const updateRpsSchema = createRpsSchema.partial().omit({ id_mk: true });

// RPS Minggu
export const createRpsMingguSchema = z.object({
  minggu_ke: z.number().int().min(1).max(16),
  id_sub_cpmk: z.string().optional(),
  materi: z.string().min(1, 'Materi wajib diisi'),
  metode_pembelajaran: z.string().optional(), // JSON array
  waktu_menit: z.number().int().min(1).default(150),
  pengalaman_belajar: z.string().optional(),
  bentuk_penilaian: z.string().optional(), // JSON array
  bobot_penilaian: z.number().min(0).max(100).optional(),
});

export const updateRpsMingguSchema = createRpsMingguSchema.partial();

// Submit for validation
export const submitRpsSchema = z.object({
  id_kaprodi: z.string().min(1, 'Kaprodi wajib dipilih'),
});

// Validate/Reject
export const validateRpsSchema = z.object({
  catatan: z.string().optional(),
});

export type CreateRpsInput = z.infer<typeof createRpsSchema>;
export type UpdateRpsInput = z.infer<typeof updateRpsSchema>;
export type CreateRpsMingguInput = z.infer<typeof createRpsMingguSchema>;
export type UpdateRpsMingguInput = z.infer<typeof updateRpsMingguSchema>;
export type SubmitRpsInput = z.infer<typeof submitRpsSchema>;
export type ValidateRpsInput = z.infer<typeof validateRpsSchema>;
