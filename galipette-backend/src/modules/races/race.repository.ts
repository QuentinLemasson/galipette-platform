import prisma from '../../config/db';
import { Race, CreateRaceDto, UpdateRaceDto } from './race.model';

interface FindAllOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

export class RaceRepository {
  /**
   * Find all races with pagination and filters
   */
  async findAll(options?: FindAllOptions): Promise<{ races: Race[]; count: number }> {
    const { ids, skip = 0, take = 10 } = options || {};

    // Build where conditions
    let where: any = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    // Execute query with pagination and get count
    const [races, count] = await Promise.all([
      prisma.race.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
      }),
      prisma.race.count({ where }),
    ]);

    return { races, count };
  }

  /**
   * Find race by ID
   */
  async findById(id: number): Promise<Race | null> {
    return prisma.race.findUnique({
      where: { id },
    });
  }

  /**
   * Find race by name
   */
  async findByName(name: string): Promise<Race | null> {
    return prisma.race.findUnique({
      where: { name },
    });
  }

  /**
   * Create a new race
   */
  async create(data: CreateRaceDto): Promise<Race> {
    return prisma.race.create({
      data,
    });
  }

  /**
   * Update a race
   */
  async update(id: number, data: UpdateRaceDto): Promise<Race> {
    return prisma.race.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a race
   */
  async delete(id: number): Promise<Race> {
    return prisma.race.delete({
      where: { id },
    });
  }
}

export default new RaceRepository();
