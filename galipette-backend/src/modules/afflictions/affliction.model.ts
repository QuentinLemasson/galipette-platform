import {
  Affliction as PrismaAffliction,
  AfflictionTag as PrismaAfflictionTag,
  Tag as PrismaTag,
  CharacterAffliction as PrismaCharacterAffliction,
} from '@prisma/client';

// Affliction domain model
export interface Affliction extends PrismaAffliction {}

// Tag domain model
export interface Tag extends PrismaTag {}

// AfflictionTag relation model
export interface AfflictionTag extends PrismaAfflictionTag {}

// CharacterAffliction relation model
export interface CharacterAffliction extends PrismaCharacterAffliction {}

// Affliction creation DTO
export interface CreateAfflictionDto {
  name: string;
  description: string;
  tagIds?: number[];
}

// Affliction update DTO
export interface UpdateAfflictionDto {
  name?: string;
  description?: string;
  tagIds?: number[];
}

// Tag creation DTO
export interface CreateTagDto {
  name: string;
}

// Character affliction DTO
export interface CharacterAfflictionDto {
  afflictionId: number;
  severity: number;
}

// Affliction response DTO
export interface AfflictionResponseDto {
  id: number;
  name: string;
  description: string;
  tags?: TagResponseDto[];
}

// Tag response DTO
export interface TagResponseDto {
  id: number;
  name: string;
}

// Character affliction response DTO
export interface CharacterAfflictionResponseDto {
  id: number;
  characterId: number;
  afflictionId: number;
  affliction: AfflictionResponseDto;
  severity: number;
}

// Function to map an Affliction entity to an AfflictionResponseDto
export function mapToAfflictionDto(
  affliction: Affliction & { tags?: { tag: Tag }[] },
): AfflictionResponseDto {
  return {
    id: affliction.id,
    name: affliction.name,
    description: affliction.description,
    ...(affliction.tags && {
      tags: affliction.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    }),
  };
}

// Function to map a Tag entity to a TagResponseDto
export function mapToTagDto(tag: Tag): TagResponseDto {
  return {
    id: tag.id,
    name: tag.name,
  };
}

// Function to map a CharacterAffliction entity to a CharacterAfflictionResponseDto
export function mapToCharacterAfflictionDto(
  charAffliction: CharacterAffliction & { affliction: Affliction & { tags?: { tag: Tag }[] } },
): CharacterAfflictionResponseDto {
  return {
    id: charAffliction.id,
    characterId: charAffliction.characterId,
    afflictionId: charAffliction.afflictionId,
    affliction: mapToAfflictionDto(charAffliction.affliction),
    severity: charAffliction.severity,
  };
}
