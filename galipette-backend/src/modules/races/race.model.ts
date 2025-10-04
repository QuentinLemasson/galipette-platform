import { Race as PrismaRace } from '@prisma/client';

// Race domain model (extends Prisma generated type)
export interface Race extends PrismaRace {}

// Race creation DTO
export interface CreateRaceDto {
  name: string;
  description?: string;
}

// Race update DTO
export interface UpdateRaceDto {
  name?: string;
  description?: string;
}

// Race response DTO
export interface RaceResponseDto {
  id: number;
  name: string;
  description?: string;
}

// Function to map a Race entity to a RaceResponseDto
export function mapToRaceDto(race: Race): RaceResponseDto {
  return {
    id: race.id,
    name: race.name,
    ...(race.description !== null &&
      race.description !== undefined && {
        description: race.description,
      }),
  };
}
