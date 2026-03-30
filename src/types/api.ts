// src/types/api.ts

export interface ServerResponse<T> {
  message: string;
  error: number;
  data: T;
}

// Você também pode centralizar outros tipos comuns aqui
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
}