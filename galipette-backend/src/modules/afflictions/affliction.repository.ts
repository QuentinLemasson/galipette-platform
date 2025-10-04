import prisma from '../../config/db';
import {
  Affliction,
  Tag,
  CharacterAffliction,
  CreateAfflictionDto,
  UpdateAfflictionDto,
  CreateTagDto,
  CharacterAfflictionDto,
} from './affliction.model';

interface FindAllAfflictionsOptions {
  ids?: number[];
  tagIds?: number[];
  skip?: number;
  take?: number;
}

interface FindAllTagsOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

export class AfflictionRepository {
  /**
   * Find all afflictions with pagination and filters
   */
  async findAllAfflictions(
    options?: FindAllAfflictionsOptions,
  ): Promise<{ afflictions: Affliction[]; count: number }> {
    const { ids, tagIds, skip = 0, take = 10 } = options || {};

    // Build where conditions
    let where: any = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: tagIds },
        },
      };
    }

    // Execute query with pagination and get count
    const [afflictions, count] = await Promise.all([
      prisma.affliction.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.affliction.count({ where }),
    ]);

    return { afflictions, count };
  }

  /**
   * Find affliction by ID
   */
  async findAfflictionById(id: number): Promise<Affliction | null> {
    return prisma.affliction.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Find affliction by name
   */
  async findAfflictionByName(name: string): Promise<Affliction | null> {
    return prisma.affliction.findUnique({
      where: { name },
    });
  }

  /**
   * Create a new affliction
   */
  async createAffliction(data: CreateAfflictionDto): Promise<Affliction> {
    const { name, description, tagIds = [] } = data;

    return prisma.affliction.create({
      data: {
        name,
        description,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Update an affliction
   */
  async updateAffliction(id: number, data: UpdateAfflictionDto): Promise<Affliction> {
    const { name, description, tagIds } = data;

    // We need to use a transaction to update both the affliction and its tags
    return prisma.$transaction(async (tx) => {
      // Update basic affliction properties
      await tx.affliction.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
        },
      });

      // Update tags if provided
      if (tagIds !== undefined) {
        // First, remove all existing tags
        await tx.afflictionTag.deleteMany({
          where: { afflictionId: id },
        });

        // Then, add the new tags
        if (tagIds.length > 0) {
          await tx.afflictionTag.createMany({
            data: tagIds.map((tagId) => ({
              afflictionId: id,
              tagId,
            })),
          });
        }
      }

      // Return the updated affliction with its tags
      return tx.affliction.findUnique({
        where: { id },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }) as Promise<Affliction>;
    });
  }

  /**
   * Delete an affliction
   */
  async deleteAffliction(id: number): Promise<Affliction> {
    return prisma.affliction.delete({
      where: { id },
    });
  }

  /**
   * Find all tags with pagination and filters
   */
  async findAllTags(options?: FindAllTagsOptions): Promise<{ tags: Tag[]; count: number }> {
    const { ids, skip = 0, take = 10 } = options || {};

    // Build where conditions
    let where: any = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    // Execute query with pagination and get count
    const [tags, count] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
      }),
      prisma.tag.count({ where }),
    ]);

    return { tags, count };
  }

  /**
   * Find tag by ID
   */
  async findTagById(id: number): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
    });
  }

  /**
   * Find tag by name
   */
  async findTagByName(name: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { name },
    });
  }

  /**
   * Create a new tag
   */
  async createTag(data: CreateTagDto): Promise<Tag> {
    return prisma.tag.create({
      data,
    });
  }

  /**
   * Delete a tag
   */
  async deleteTag(id: number): Promise<Tag> {
    return prisma.tag.delete({
      where: { id },
    });
  }

  /**
   * Get afflictions for a character
   */
  async getCharacterAfflictions(characterId: number): Promise<CharacterAffliction[]> {
    return prisma.characterAffliction.findMany({
      where: { characterId },
      include: {
        affliction: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Apply affliction to character
   */
  async applyAfflictionToCharacter(
    characterId: number,
    afflictionData: CharacterAfflictionDto,
  ): Promise<CharacterAffliction> {
    return prisma.characterAffliction.create({
      data: {
        characterId,
        afflictionId: afflictionData.afflictionId,
        severity: afflictionData.severity,
      },
      include: {
        affliction: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update character affliction severity
   */
  async updateCharacterAffliction(id: number, severity: number): Promise<CharacterAffliction> {
    return prisma.characterAffliction.update({
      where: { id },
      data: { severity },
      include: {
        affliction: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Remove affliction from character
   */
  async removeAfflictionFromCharacter(id: number): Promise<CharacterAffliction> {
    return prisma.characterAffliction.delete({
      where: { id },
    });
  }

  /**
   * Find character affliction by ID
   */
  async findCharacterAfflictionById(id: number): Promise<CharacterAffliction | null> {
    return prisma.characterAffliction.findUnique({
      where: { id },
      include: {
        affliction: true,
      },
    });
  }

  /**
   * Find character affliction by character ID and affliction ID
   */
  async findCharacterAfflictionByIds(
    characterId: number,
    afflictionId: number,
  ): Promise<CharacterAffliction | null> {
    return prisma.characterAffliction.findFirst({
      where: {
        characterId,
        afflictionId,
      },
      include: {
        affliction: true,
      },
    });
  }
}

export default new AfflictionRepository();
