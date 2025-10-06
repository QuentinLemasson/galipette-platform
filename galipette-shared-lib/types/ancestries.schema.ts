import { z } from 'zod';
import { createPaginatedListSchema } from './common.schema';

// ============================================
// INPUT VALIDATION SCHEMAS (Request DTOs)
// ============================================

/**
 * Schema for creating a new ancestry
 * Used for POST /api/ancestries
 */
export const createAncestrySchema = z.object({
  name: z
    .string()
    .min(3, 'Ancestry name must be at least 3 characters')
    .max(100, 'Ancestry name must not exceed 100 characters'),
  description: z.string().optional(),
});

/**
 * Schema for updating an existing ancestry
 * Used for PATCH /api/ancestries/:id
 * All fields are optional (partial update)
 */
export const updateAncestrySchema = createAncestrySchema.partial();

/**
 * Schema for ancestry ID parameter
 * Used for validating route parameters
 */
export const ancestryIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ============================================
// OUTPUT SCHEMAS (Response DTOs)
// ============================================

/**
 * Schema for ancestry response data
 * Used for API responses
 */
export const ancestryResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().optional(),
});

/**
 * Schema for paginated ancestry list response
 */
export const ancestryListResponseSchema = createPaginatedListSchema(
  ancestryResponseSchema,
  'ancestries'
);

// ============================================
// INFERRED TYPESCRIPT TYPES
// ============================================

/**
 * Type for creating a new ancestry (input)
 */
export type CreateAncestryDto = z.infer<typeof createAncestrySchema>;

/**
 * Type for updating an ancestry (input)
 */
export type UpdateAncestryDto = z.infer<typeof updateAncestrySchema>;

/**
 * Type for ancestry response (output)
 */
export type AncestryResponseDto = z.infer<typeof ancestryResponseSchema>;

/**
 * Type for ancestry ID parameter
 */
export type AncestryIdParam = z.infer<typeof ancestryIdSchema>;

/**
 * Type for paginated ancestry list response
 */
export type AncestryListResponseDto = z.infer<
  typeof ancestryListResponseSchema
>;
