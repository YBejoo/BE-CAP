// src/validators/dosen.validator.ts
import { z } from 'zod';

export const createDosenSchema = z.object({
  nip: z.string().min(1, 'NIP wajib diisi'),
  nama_dosen: z.string().min(1, 'Nama dosen wajib diisi'),
  email: z.string().email().optional().or(z.literal('')),
  bidang_keahlian: z.string().optional(),
  jabatan_fungsional: z.enum([
    'Tenaga Pengajar', 
    'Asisten Ahli', 
    'Lektor', 
    'Lektor Kepala', 
    'Guru Besar'
  ]).optional(),
  id_prodi: z.string().optional(),
  id_user: z.string().optional(),
});

export const updateDosenSchema = createDosenSchema.partial();

export type CreateDosenInput = z.infer<typeof createDosenSchema>;
export type UpdateDosenInput = z.infer<typeof updateDosenSchema>;
