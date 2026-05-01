/**
 * @fileOverview Domain models, DTOs and Prisma -> API mappers for the
 * MagicItem and MagicItemType entities.
 */
import {
  MagicItem as PrismaMagicItem,
  MagicItemType as PrismaMagicItemType,
} from '@prisma/client';
import {
  CreateMagicItemDto,
  UpdateMagicItemDto,
  MagicItemResponseDto,
  CreateMagicItemTypeDto,
  UpdateMagicItemTypeDto,
  MagicItemTypeResponseDto,
  magicItemResponseSchema,
  magicItemTypeResponseSchema,
} from '@galipette/shared';

// ============================================
// DOMAIN MODELS
// ============================================

export interface MagicItem extends PrismaMagicItem {}
export interface MagicItemType extends PrismaMagicItemType {}

/** A magic item joined with its type (used for response DTOs). */
export type MagicItemWithType = MagicItem & { type: MagicItemType };

// ============================================
// RE-EXPORT SHARED DTOs
// ============================================

export type {
  CreateMagicItemDto,
  UpdateMagicItemDto,
  MagicItemResponseDto,
  CreateMagicItemTypeDto,
  UpdateMagicItemTypeDto,
  MagicItemTypeResponseDto,
};

// ============================================
// MAPPERS
// ============================================

/**
 * Maps a Prisma MagicItemType entity to the public response DTO,
 * validated against the shared Zod schema.
 */
export function mapToMagicItemTypeDto(
  type: MagicItemType
): MagicItemTypeResponseDto {
  return magicItemTypeResponseSchema.parse({
    id: type.id,
    name: type.name,
  });
}

/**
 * Maps a Prisma MagicItem (joined with its type) to the public response DTO,
 * validated against the shared Zod schema.
 */
export function mapToMagicItemDto(
  item: MagicItemWithType
): MagicItemResponseDto {
  return magicItemResponseSchema.parse({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image ?? undefined,
    type: {
      id: item.type.id,
      name: item.type.name,
    },
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });
}
