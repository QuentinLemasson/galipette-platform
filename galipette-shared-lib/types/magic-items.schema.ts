/**
 * @fileOverview Zod schemas and inferred DTOs for the Magic Items domain.
 *
 * Two related entities are defined:
 * - MagicItemType: a relational lookup table (e.g. "Arme", "Potion").
 * - MagicItem: the magical artefact, linked to a single type.
 */
import { z } from 'zod';
import { createPaginatedListSchema } from './common.schema';

// ============================================
// MAGIC ITEM TYPE SCHEMAS
// ============================================

/**
 * Schema for creating a new magic item type
 * Used for POST /api/magic-item-types
 */
export const createMagicItemTypeSchema = z.object({
  name: z
    .string()
    .min(2, 'Type name must be at least 2 characters')
    .max(50, 'Type name must not exceed 50 characters'),
});

/**
 * Schema for updating an existing magic item type
 * Used for PATCH /api/magic-item-types/:id
 */
export const updateMagicItemTypeSchema = createMagicItemTypeSchema.partial();

/**
 * Schema for magic item type ID parameter
 */
export const magicItemTypeIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Schema for magic item type response
 */
export const magicItemTypeResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

/**
 * Paginated list of magic item types
 */
export const magicItemTypeListResponseSchema = createPaginatedListSchema(
  magicItemTypeResponseSchema,
  'magicItemTypes'
);

// ============================================
// MAGIC ITEM SCHEMAS
// ============================================

/**
 * Schema for creating a new magic item
 * Used for POST /api/magic-items
 */
export const createMagicItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must not exceed 2000 characters'),
  image: z
    .union([z.string().url('Image must be a valid URL'), z.literal('')])
    .optional()
    .transform(value =>
      value === '' || value === undefined ? undefined : value
    ),
  typeId: z.number().int().positive(),
});

/**
 * Schema for updating an existing magic item
 * Used for PATCH /api/magic-items/:id
 */
export const updateMagicItemSchema = createMagicItemSchema.partial();

/**
 * Schema for magic item ID parameter
 */
export const magicItemIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Schema for magic item response
 */
export const magicItemResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  image: z.string().nullable().optional(),
  type: magicItemTypeResponseSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Paginated list of magic items
 */
export const magicItemListResponseSchema = createPaginatedListSchema(
  magicItemResponseSchema,
  'magicItems'
);

// ============================================
// INFERRED TYPESCRIPT TYPES
// ============================================

export type CreateMagicItemTypeDto = z.infer<typeof createMagicItemTypeSchema>;
export type UpdateMagicItemTypeDto = z.infer<typeof updateMagicItemTypeSchema>;
export type MagicItemTypeIdParam = z.infer<typeof magicItemTypeIdSchema>;
export type MagicItemTypeResponseDto = z.infer<
  typeof magicItemTypeResponseSchema
>;
export type MagicItemTypeListResponseDto = z.infer<
  typeof magicItemTypeListResponseSchema
>;

export type CreateMagicItemDto = z.infer<typeof createMagicItemSchema>;
export type UpdateMagicItemDto = z.infer<typeof updateMagicItemSchema>;
export type MagicItemIdParam = z.infer<typeof magicItemIdSchema>;
export type MagicItemResponseDto = z.infer<typeof magicItemResponseSchema>;
export type MagicItemListResponseDto = z.infer<
  typeof magicItemListResponseSchema
>;
