import { z } from 'zod';

// ============================================
// COMMON PAGINATION SCHEMA
// ============================================

/**
 * Schema for pagination metadata
 * Used in all paginated list responses
 */
export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

/**
 * Type for pagination metadata
 */
export type PaginationDto = z.infer<typeof paginationSchema>;

// ============================================
// GENERIC PAGINATED LIST SCHEMA FACTORY
// ============================================

/**
 * Creates a paginated list schema for any entity
 *
 * @param itemSchema - The Zod schema for a single item
 * @param dataKey - The key name for the data array (e.g., 'users', 'campaigns')
 * @returns A schema for a paginated list response
 *
 * @example
 * ```typescript
 * const userListResponseSchema = createPaginatedListSchema(
 *   userResponseSchema,
 *   'users'
 * );
 * ```
 */
export function createPaginatedListSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
  dataKey: string
) {
  return z.object({
    [dataKey]: z.array(itemSchema),
    pagination: paginationSchema,
  });
}

/**
 * Helper type to infer the type of a paginated list
 *
 * @example
 * ```typescript
 * type UserListResponse = PaginatedList<UserResponseDto, 'users'>;
 * // { users: UserResponseDto[]; pagination: PaginationDto }
 * ```
 */
export type PaginatedList<TItem, TKey extends string> = {
  [K in TKey]: TItem[];
} & {
  pagination: PaginationDto;
};
