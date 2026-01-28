// src/utils/pagination.ts

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  offset: number;
  limit: number;
  page: number;
}

export function getPagination(params: PaginationParams): PaginationResult {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const offset = (page - 1) * limit;

  return { offset, limit, page };
}

export function parsePaginationQuery(query: Record<string, string>): PaginationParams {
  return {
    page: query.page ? parseInt(query.page, 10) : undefined,
    limit: query.limit ? parseInt(query.limit, 10) : undefined,
  };
}
