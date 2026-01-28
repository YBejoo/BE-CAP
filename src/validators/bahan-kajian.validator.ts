// src/validators/bahan-kajian.validator.ts
import { z } from 'zod';
import { aspekEnum } from './kompetensi-utama.validator';

export const createBahanKajianSchema = z.object({
  kode_bk: z.string().min(1, 'Kode Bahan Kajian wajib diisi'), // BK-01, BK-02
  nama_bahan_kajian: z.string().min(1, 'Nama Bahan Kajian wajib diisi'),
  aspek: aspekEnum,
  ranah_keilmuan: z.string().min(1, 'Ranah keilmuan wajib diisi'),
  id_kurikulum: z.string().min(1, 'Kurikulum wajib dipilih'),
});

export const updateBahanKajianSchema = createBahanKajianSchema.partial().omit({ id_kurikulum: true });

// Matrix CPL-BK
export const matrixCplBkSchema = z.object({
  mappings: z.array(z.object({
    id_cpl: z.string(),
    id_bk: z.string(),
  })),
});

export type CreateBahanKajianInput = z.infer<typeof createBahanKajianSchema>;
export type UpdateBahanKajianInput = z.infer<typeof updateBahanKajianSchema>;
export type MatrixCplBkInput = z.infer<typeof matrixCplBkSchema>;
