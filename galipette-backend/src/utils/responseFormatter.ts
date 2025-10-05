import { ZodIssue } from 'zod';

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  status: 'error';
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Format a success response
 * @param data - The response data
 * @param meta - Optional metadata (pagination, etc.)
 * @returns Formatted API success response
 */
export function formatSuccess<T>(
  data: T,
  meta?: ApiSuccessResponse<T>['meta']
): ApiSuccessResponse<T> {
  return {
    status: 'success',
    data,
    ...(meta && { meta }),
  };
}

/**
 * Format Zod validation errors into the standard error format
 * @param issues - Zod validation issues
 * @returns Formatted errors in Record<string, string[]> format
 */
export function formatZodErrors(issues: ZodIssue[]): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of issues) {
    // Convert path to string, filtering out symbols
    const path = issue.path
      .filter((p): p is string | number => typeof p !== 'symbol')
      .join('.');
    const key = path || 'general';

    if (!errors[key]) {
      errors[key] = [];
    }

    errors[key].push(issue.message);
  }

  return errors;
}

/**
 * Format an error response
 * @param message - Error message
 * @param errors - Optional validation errors
 * @returns Formatted API error response
 */
export function formatError(
  message: string,
  errors?: Record<string, string[]>
): ApiErrorResponse {
  return {
    status: 'error',
    message,
    ...(errors && { errors }),
  };
}

/**
 * Format paginated response with metadata
 * @param data - The response data
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total items count
 * @returns Formatted API success response with pagination metadata
 */
export function formatPaginatedResponse<T>(
  data: T,
  page: number,
  limit: number,
  total: number
): ApiSuccessResponse<T> {
  return formatSuccess(data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
