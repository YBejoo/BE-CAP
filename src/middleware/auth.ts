// src/middleware/auth.ts
import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'admin' | 'kaprodi' | 'dosen';
  nama: string;
  id_prodi?: string;
  exp: number;
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized - No token provided' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256') as unknown as JWTPayload;
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ success: false, error: 'Token expired' }, 401);
    }
    
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }
}

/**
 * Role-based access control middleware
 * Usage: app.use('/admin/*', requireRole('admin'))
 */
export function requireRole(...roles: Array<'admin' | 'kaprodi' | 'dosen'>) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as JWTPayload | undefined;
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    if (!roles.includes(user.role)) {
      return c.json({ 
        success: false, 
        error: 'Forbidden - Insufficient permissions',
        required: roles,
        current: user.role
      }, 403);
    }
    
    await next();
  };
}

/**
 * Optional auth middleware - doesn't fail if no token
 */
export async function optionalAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const payload = await verify(token, c.env.JWT_SECRET, 'HS256') as unknown as JWTPayload;
      c.set('user', payload);
    } catch {
      // Token invalid, but we don't fail - just don't set user
    }
  }
  
  await next();
}
