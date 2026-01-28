// src/validators/profil-lulusan.validator.ts
import { z } from 'zod';

export const createProfilLulusanSchema = z.object({
  kode_profil: z.string().min(1, 'Kode profil wajib diisi'), // PL-01, PL-02
  profil_lulusan: z.string().min(1, 'Profil lulusan wajib diisi'),
  deskripsi: z.string().min(1, 'Deskripsi wajib diisi'),
  sumber: z.string().min(1, 'Sumber wajib diisi'),
  id_kurikulum: z.string().min(1, 'Kurikulum wajib dipilih'),
});

export const updateProfilLulusanSchema = createProfilLulusanSchema.partial().omit({ id_kurikulum: true });

export type CreateProfilLulusanInput = z.infer<typeof createProfilLulusanSchema>;
export type UpdateProfilLulusanInput = z.infer<typeof updateProfilLulusanSchema>;
