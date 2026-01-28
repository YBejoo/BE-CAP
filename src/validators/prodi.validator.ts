// src/validators/prodi.validator.ts
import { z } from 'zod';

export const createProdiSchema = z.object({
  kode_prodi: z.string().min(1, 'Kode prodi wajib diisi'),
  nama_prodi: z.string().min(1, 'Nama prodi wajib diisi'),
  fakultas: z.string().min(1, 'Fakultas wajib diisi'),
  jenjang: z.enum(['D3', 'D4', 'S1', 'S2', 'S3']),
  akreditasi: z.string().optional(),
});

export const updateProdiSchema = createProdiSchema.partial();

export type CreateProdiInput = z.infer<typeof createProdiSchema>;
export type UpdateProdiInput = z.infer<typeof updateProdiSchema>;
