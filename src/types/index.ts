// src/types/index.ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import * as relations from '../db/relations';

export type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ENVIRONMENT: string;
};

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema & typeof relations>>;

export type Variables = {
  db: DrizzleDB;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'kaprodi' | 'dosen';
    nama: string;
    id_prodi?: string;
  };
};

export type AppContext = {
  Bindings: Bindings;
  Variables: Variables;
};
