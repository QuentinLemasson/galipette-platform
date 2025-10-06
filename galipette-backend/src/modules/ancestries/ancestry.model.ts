import { Ancestry as PrismaAncestry } from '@prisma/client';

// Ancestry domain model (extends Prisma generated type)
export interface Ancestry extends PrismaAncestry {}

// Ancestry creation DTO
export interface CreateAncestryDto {
  name: string;
  description?: string;
}

// Ancestry update DTO
export interface UpdateAncestryDto {
  name?: string;
  description?: string;
}

// Ancestry response DTO
export interface AncestryResponseDto {
  id: number;
  name: string;
  description?: string;
}

// Function to map an Ancestry entity to an AncestryResponseDto
export function mapToAncestryDto(ancestry: Ancestry): AncestryResponseDto {
  return {
    id: ancestry.id,
    name: ancestry.name,
    ...(ancestry.description !== null &&
      ancestry.description !== undefined && {
        description: ancestry.description,
      }),
  };
}
