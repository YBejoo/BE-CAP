// src/validators/auth.validator.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  role: z.enum(['admin', 'kaprodi', 'dosen']).default('dosen'),
  id_prodi: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email tidak valid').optional(),
  nama: z.string().min(1).optional(),
  role: z.enum(['admin', 'kaprodi', 'dosen']).optional(),
  id_prodi: z.string().optional(),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Password lama wajib diisi'),
  new_password: z.string().min(6, 'Password baru minimal 6 karakter'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
