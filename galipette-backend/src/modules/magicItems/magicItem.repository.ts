/**
 * @fileOverview Prisma repository for MagicItem and MagicItemType entities.
 */
import prisma from '../../config/db';
import {
  MagicItem,
  MagicItemType,
  MagicItemWithType,
  CreateMagicItemDto,
  UpdateMagicItemDto,
  CreateMagicItemTypeDto,
  UpdateMagicItemTypeDto,
} from './magicItem.model';

interface FindAllMagicItemsOptions {
  ids?: number[];
  typeIds?: number[];
  search?: string;
  skip?: number;
  take?: number;
}

interface FindAllMagicItemTypesOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

export class MagicItemRepository {
  // ============================================
  // MAGIC ITEMS
  // ============================================

  /**
   * Find all magic items with pagination, search and filters.
   * Always includes the linked type so callers can map to DTOs directly.
   */
  async findAllMagicItems(
    options?: FindAllMagicItemsOptions
  ): Promise<{ items: MagicItemWithType[]; count: number }> {
    const { ids, typeIds, search, skip = 0, take = 10 } = options || {};

    const where: any = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (typeIds && typeIds.length > 0) {
      where.typeId = { in: typeIds };
    }

    if (search && search.trim().length > 0) {
      where.name = { contains: search.trim(), mode: 'insensitive' };
    }

    const [items, count] = await Promise.all([
      prisma.magicItem.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: { type: true },
      }),
      prisma.magicItem.count({ where }),
    ]);

    return { items, count };
  }

  async findMagicItemById(id: number): Promise<MagicItemWithType | null> {
    return prisma.magicItem.findUnique({
      where: { id },
      include: { type: true },
    });
  }

  async findMagicItemByName(name: string): Promise<MagicItem | null> {
    return prisma.magicItem.findUnique({
      where: { name },
    });
  }

  async createMagicItem(data: CreateMagicItemDto): Promise<MagicItemWithType> {
    return prisma.magicItem.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        typeId: data.typeId,
      },
      include: { type: true },
    });
  }

  async updateMagicItem(
    id: number,
    data: UpdateMagicItemDto
  ): Promise<MagicItemWithType> {
    return prisma.magicItem.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.typeId !== undefined && { typeId: data.typeId }),
      },
      include: { type: true },
    });
  }

  async deleteMagicItem(id: number): Promise<MagicItem> {
    return prisma.magicItem.delete({ where: { id } });
  }

  // ============================================
  // MAGIC ITEM TYPES
  // ============================================

  async findAllMagicItemTypes(
    options?: FindAllMagicItemTypesOptions
  ): Promise<{ types: MagicItemType[]; count: number }> {
    const { ids, skip = 0, take = 100 } = options || {};

    const where: any = {};
    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    const [types, count] = await Promise.all([
      prisma.magicItemType.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.magicItemType.count({ where }),
    ]);

    return { types, count };
  }

  async findMagicItemTypeById(id: number): Promise<MagicItemType | null> {
    return prisma.magicItemType.findUnique({ where: { id } });
  }

  async findMagicItemTypeByName(name: string): Promise<MagicItemType | null> {
    return prisma.magicItemType.findUnique({ where: { name } });
  }

  async createMagicItemType(
    data: CreateMagicItemTypeDto
  ): Promise<MagicItemType> {
    return prisma.magicItemType.create({ data });
  }

  async updateMagicItemType(
    id: number,
    data: UpdateMagicItemTypeDto
  ): Promise<MagicItemType> {
    return prisma.magicItemType.update({
      where: { id },
      data,
    });
  }

  async deleteMagicItemType(id: number): Promise<MagicItemType> {
    return prisma.magicItemType.delete({ where: { id } });
  }
}

export default new MagicItemRepository();
