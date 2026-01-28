// src/validators/cpl.validator.ts
import { z } from 'zod';
import { aspekEnum } from './kompetensi-utama.validator';

export const createCplSchema = z.object({
  kode_cpl: z.string().min(1, 'Kode CPL wajib diisi'), // CPL-01 atau S1, P1
  deskripsi_cpl: z.string().min(1, 'Deskripsi CPL wajib diisi'),
  aspek: aspekEnum,
  id_kurikulum: z.string().min(1, 'Kurikulum wajib dipilih'),
});

export const updateCplSchema = createCplSchema.partial().omit({ id_kurikulum: true });

// Matrix CPL-PL
export const matrixCplPlSchema = z.object({
  mappings: z.array(z.object({
    id_cpl: z.string(),
    id_profil: z.string(),
  })),
});

export type CreateCplInput = z.infer<typeof createCplSchema>;
export type UpdateCplInput = z.infer<typeof updateCplSchema>;
export type MatrixCplPlInput = z.infer<typeof matrixCplPlSchema>;
