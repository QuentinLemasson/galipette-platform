import prisma from '../../config/db';
import {
  Ancestry,
  CreateAncestryDto,
  UpdateAncestryDto,
} from './ancestry.model';

interface FindAllOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

export class AncestryRepository {
  /**
   * Find all ancestries with pagination and filters
   */
  async findAll(
    options?: FindAllOptions
  ): Promise<{ ancestries: Ancestry[]; count: number }> {
    const { ids, skip = 0, take = 10 } = options || {};

    // Build where conditions
    let where: any = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    // Execute query with pagination and get count
    const [ancestries, count] = await Promise.all([
      prisma.ancestry.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
      }),
      prisma.ancestry.count({ where }),
    ]);

    return { ancestries, count };
  }

  /**
   * Find ancestry by ID
   */
  async findById(id: number): Promise<Ancestry | null> {
    return prisma.ancestry.findUnique({
      where: { id },
    });
  }

  /**
   * Find ancestry by name
   */
  async findByName(name: string): Promise<Ancestry | null> {
    return prisma.ancestry.findUnique({
      where: { name },
    });
  }

  /**
   * Create a new ancestry
   */
  async create(data: CreateAncestryDto): Promise<Ancestry> {
    return prisma.ancestry.create({
      data,
    });
  }

  /**
   * Update an ancestry
   */
  async update(id: number, data: UpdateAncestryDto): Promise<Ancestry> {
    return prisma.ancestry.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an ancestry
   */
  async delete(id: number): Promise<Ancestry> {
    return prisma.ancestry.delete({
      where: { id },
    });
  }
}

export default new AncestryRepository();
