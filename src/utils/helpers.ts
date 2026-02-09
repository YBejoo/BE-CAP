// src/utils/helpers.ts
import { nanoid } from 'nanoid';

/**
 * Generate unique ID using nanoid
 */
export function generateId(size: number = 21): string {
  return nanoid(size);
}

/**
 * Parse JSON safely, returns null on error
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date * 1000) : date;
  return d.toISOString();
}

/**
 * Get current timestamp in seconds (Unix epoch)
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Omit specified keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Pick specified keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Slugify string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Transform field names for frontend compatibility
 * Maps generic 'id' to entity-specific ID field names
 */
export function transformEntityId<T extends { id: string }>(
  entity: T, 
  idFieldName: string
): Omit<T, 'id'> & Record<string, string> {
  const { id, ...rest } = entity;
  return {
    ...rest,
    [idFieldName]: id,
  };
}

/**
 * Transform array of entities with ID field mapping
 */
export function transformEntitiesId<T extends { id: string }>(
  entities: T[],
  idFieldName: string
): Array<Omit<T, 'id'> & Record<string, string>> {
  return entities.map(entity => transformEntityId(entity, idFieldName));
}

/**
 * Transform nested object IDs recursively
 */
export function transformNestedIds(obj: any, mappings: Record<string, string>): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => transformNestedIds(item, mappings));
  }
  
  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Transform ID if it matches a mapping
    if (key === 'id' && mappings[key]) {
      result[mappings[key]] = value;
    } else if (typeof value === 'object' && value !== null) {
      result[key] = transformNestedIds(value, mappings);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}
