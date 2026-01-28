// src/validators/kurikulum.validator.ts
import { z } from 'zod';

export const createKurikulumSchema = z.object({
  nama_kurikulum: z.string().min(1, 'Nama kurikulum wajib diisi'),
  tahun_berlaku: z.number().int().min(2000).max(2100),
  is_active: z.boolean().default(false),
  id_prodi: z.string().min(1, 'Prodi wajib dipilih'),
});

export const updateKurikulumSchema = createKurikulumSchema.partial();

export type CreateKurikulumInput = z.infer<typeof createKurikulumSchema>;
export type UpdateKurikulumInput = z.infer<typeof updateKurikulumSchema>;
