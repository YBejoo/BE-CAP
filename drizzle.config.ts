// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/fadda63434a5f4b81264702216c8fd12082a81545356d993faa9a29a89656094.sqlite',
  },
});
