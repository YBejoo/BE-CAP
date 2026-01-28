// src/validators/kompetensi-utama.validator.ts
import { z } from 'zod';

// Aspek: S = Sikap, P = Pengetahuan, KU = Keterampilan Umum, KK = Keterampilan Khusus
export const aspekEnum = z.enum(['S', 'P', 'KU', 'KK']);

export const createKompetensiUtamaSchema = z.object({
  kode_kul: z.string().min(1, 'Kode KUL wajib diisi'), // S1, P1, KU1, KK1
  kompetensi_lulusan: z.string().min(1, 'Kompetensi lulusan wajib diisi'),
  aspek: aspekEnum,
  id_kurikulum: z.string().min(1, 'Kurikulum wajib dipilih'),
});

export const updateKompetensiUtamaSchema = createKompetensiUtamaSchema.partial().omit({ id_kurikulum: true });

export type CreateKompetensiUtamaInput = z.infer<typeof createKompetensiUtamaSchema>;
export type UpdateKompetensiUtamaInput = z.infer<typeof updateKompetensiUtamaSchema>;
