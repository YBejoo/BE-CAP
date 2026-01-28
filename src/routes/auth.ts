// src/routes/auth.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { sign, verify } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { users } from '../db/schema';
import { successResponse, errorResponse } from '../utils/response';
import { registerSchema, loginSchema, changePasswordSchema } from '../validators/auth.validator';
import { authMiddleware } from '../middleware/auth';
import type { AppContext } from '../types';

// Simple hash function for Workers environment
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

const app = new Hono<AppContext>();

// POST /api/auth/register
app.post('/register', zValidator('json', registerSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  try {
    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    
    if (existingUser.length > 0) {
      return c.json(errorResponse('Email sudah terdaftar'), 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const id = nanoid();
    await db.insert(users).values({
      id,
      email: data.email,
      password: hashedPassword,
      nama: data.nama,
      role: data.role || 'dosen',
      id_prodi: data.id_prodi,
    });

    const newUser = await db.select({
      id: users.id,
      email: users.email,
      nama: users.nama,
      role: users.role,
      id_prodi: users.id_prodi,
      created_at: users.created_at,
    }).from(users).where(eq(users.id, id));

    return c.json(successResponse(newUser[0], 'Registrasi berhasil'), 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json(errorResponse('Gagal melakukan registrasi'), 500);
  }
});

// POST /api/auth/login
app.post('/login', zValidator('json', loginSchema), async (c) => {
  const db = c.get('db');
  const { email, password } = c.req.valid('json');

  try {
    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length === 0) {
      return c.json(errorResponse('Email atau password salah'), 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user[0].password);
    
    if (!isValid) {
      return c.json(errorResponse('Email atau password salah'), 401);
    }

    // Generate JWT
    const payload = {
      id: user[0].id,
      email: user[0].email,
      nama: user[0].nama,
      role: user[0].role,
      id_prodi: user[0].id_prodi,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    };

    const token = await sign(payload, c.env.JWT_SECRET);

    return c.json(successResponse({
      token,
      user: {
        id: user[0].id,
        email: user[0].email,
        nama: user[0].nama,
        role: user[0].role,
        id_prodi: user[0].id_prodi,
      }
    }, 'Login berhasil'));
  } catch (error) {
    console.error('Login error:', error);
    return c.json(errorResponse('Gagal melakukan login'), 500);
  }
});

// POST /api/auth/refresh
app.post('/refresh', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(errorResponse('Token tidak ditemukan'), 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET) as any;
    
    // Generate new token
    const newPayload = {
      id: payload.id,
      email: payload.email,
      nama: payload.nama,
      role: payload.role,
      id_prodi: payload.id_prodi,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    };

    const newToken = await sign(newPayload, c.env.JWT_SECRET);

    return c.json(successResponse({ token: newToken }, 'Token refreshed'));
  } catch (error) {
    return c.json(errorResponse('Token tidak valid'), 401);
  }
});

// GET /api/auth/me
app.get('/me', authMiddleware, async (c) => {
  const db = c.get('db');
  const user = c.get('user');

  try {
    const result = await db.select({
      id: users.id,
      email: users.email,
      nama: users.nama,
      role: users.role,
      id_prodi: users.id_prodi,
      created_at: users.created_at,
    }).from(users).where(eq(users.id, user.id));

    if (result.length === 0) {
      return c.json(errorResponse('User tidak ditemukan'), 404);
    }

    return c.json(successResponse(result[0]));
  } catch (error) {
    return c.json(errorResponse('Gagal mengambil data user'), 500);
  }
});

// POST /api/auth/change-password
app.post('/change-password', authMiddleware, zValidator('json', changePasswordSchema), async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const { old_password, new_password } = c.req.valid('json');

  try {
    const result = await db.select().from(users).where(eq(users.id, user.id));
    
    if (result.length === 0) {
      return c.json(errorResponse('User tidak ditemukan'), 404);
    }

    // Verify old password
    const isValid = await verifyPassword(old_password, result[0].password);
    
    if (!isValid) {
      return c.json(errorResponse('Password lama salah'), 401);
    }

    // Hash new password
    const hashedPassword = await hashPassword(new_password);

    // Update password
    await db.update(users)
      .set({ password: hashedPassword, updated_at: new Date() })
      .where(eq(users.id, user.id));

    return c.json(successResponse(null, 'Password berhasil diubah'));
  } catch (error) {
    return c.json(errorResponse('Gagal mengubah password'), 500);
  }
});

// POST /api/auth/logout (client-side token removal)
app.post('/logout', (c) => {
  return c.json(successResponse(null, 'Logout berhasil'));
});

export default app;
