// Type declarations for Bun's built-in SQLite
declare module 'bun:sqlite' {
  export class Database {
    constructor(filename: string, options?: any);
    close(): void;
    prepare(sql: string): any;
    exec(sql: string): void;
    run(sql: string, ...params: any[]): any;
    get(sql: string, ...params: any[]): any;
    all(sql: string, ...params: any[]): any[];
  }
}

// Type declarations for Node.js built-in modules in Bun
declare module 'node:fs' {
  export function readdirSync(path: string): string[];
  export function existsSync(path: string): boolean;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
}
