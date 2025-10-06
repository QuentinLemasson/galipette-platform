import {
  Character as PrismaCharacter,
  CharacterAttribute as PrismaCharacterAttribute,
  AttributeType,
} from '@prisma/client';

// Character domain model (extends Prisma generated type)
export interface Character extends PrismaCharacter {}

// Character Attribute model
export interface CharacterAttribute extends PrismaCharacterAttribute {}

// Character creation DTO
export interface CreateCharacterDto {
  name: string;
  ancestryId: number;
  userId: number;
  campaignId: number;
  hitPoints: number;
  maxHitPoints: number;
  attributes?: CharacterAttributeDto[];
}

// Character update DTO
export interface UpdateCharacterDto {
  name?: string;
  ancestryId?: number;
  hitPoints?: number;
  maxHitPoints?: number;
  skillPoints?: number;
}

// Character attribute DTO
export interface CharacterAttributeDto {
  type: AttributeType;
  value: number;
}

// Character attribute update DTO
export interface UpdateCharacterAttributesDto {
  attributes: CharacterAttributeDto[];
}

// Character response DTO
export interface CharacterResponseDto {
  id: number;
  name: string;
  ancestryId: number;
  ancestryName?: string;
  userId: number;
  campaignId: number;
  hitPoints: number;
  maxHitPoints: number;
  skillPoints: number;
  attributes?: CharacterAttributeDto[];
  afflictions?: CharacterAfflictionDto[];
  createdAt: Date;
  updatedAt: Date;
}

// Character affliction DTO
export interface CharacterAfflictionDto {
  id: number;
  afflictionId: number;
  afflictionName: string;
  severity: number;
}

// Function to map a Character entity to a CharacterResponseDto
export function mapToCharacterDto(
  character: Character & {
    ancestry?: { name: string };
    attributes?: CharacterAttribute[];
    afflictions?: any[];
  }
): CharacterResponseDto {
  return {
    id: character.id,
    name: character.name,
    ancestryId: character.ancestryId,
    ...(character.ancestry?.name !== undefined && {
      ancestryName: character.ancestry.name,
    }),
    userId: character.userId,
    campaignId: character.campaignId,
    hitPoints: character.hitPoints,
    maxHitPoints: character.maxHitPoints,
    skillPoints: character.skillPoints,
    ...(character.attributes && {
      attributes: character.attributes.map(attr => ({
        type: attr.type,
        value: attr.value,
      })),
    }),
    ...(character.afflictions && {
      afflictions: character.afflictions.map(aff => ({
        id: aff.id,
        afflictionId: aff.afflictionId,
        afflictionName: aff.affliction.name,
        severity: aff.severity,
      })),
    }),
    createdAt: character.createdAt,
    updatedAt: character.updatedAt,
  };
}
