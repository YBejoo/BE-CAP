// src/middleware/error-handler.ts
import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

export function errorHandler(err: Error, c: Context) {
  console.error('Error:', err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return c.json({
      success: false,
      error: 'Validation error',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    }, 400);
  }

  // Handle Hono HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      error: err.message,
    }, err.status);
  }

  // Handle specific error types
  if (err.message.includes('UNIQUE constraint failed')) {
    return c.json({
      success: false,
      error: 'Duplicate entry - This record already exists',
    }, 409);
  }

  if (err.message.includes('FOREIGN KEY constraint failed')) {
    return c.json({
      success: false,
      error: 'Referenced record not found',
    }, 400);
  }

  // Default error response
  return c.json({
    success: false,
    error: c.env.ENVIRONMENT === 'development' ? err.message : 'Internal server error',
  }, 500);
}
