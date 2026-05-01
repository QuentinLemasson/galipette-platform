/**
 * @fileOverview Business-logic service for MagicItem and MagicItemType.
 *
 * Enforces uniqueness of names, validates referential integrity (typeId must
 * exist), and translates Prisma foreign-key errors into 409 ApiErrors.
 */
import {
  MagicItem,
  MagicItemType,
  MagicItemWithType,
  CreateMagicItemDto,
  UpdateMagicItemDto,
  CreateMagicItemTypeDto,
  UpdateMagicItemTypeDto,
} from './magicItem.model';
import magicItemRepository from './magicItem.repository';
import { ApiError } from '../../middleware/errorHandler';

interface GetAllMagicItemsOptions {
  ids?: number[];
  typeIds?: number[];
  search?: string;
  skip?: number;
  take?: number;
}

interface GetAllMagicItemTypesOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

class MagicItemService {
  // ============================================
  // MAGIC ITEMS
  // ============================================

  async getAllMagicItems(
    options?: GetAllMagicItemsOptions
  ): Promise<{ items: MagicItemWithType[]; count: number }> {
    return magicItemRepository.findAllMagicItems(options);
  }

  async getMagicItemById(id: number): Promise<MagicItemWithType> {
    const item = await magicItemRepository.findMagicItemById(id);

    if (!item) {
      throw new ApiError(404, 'Magic item not found');
    }

    return item;
  }

  async createMagicItem(data: CreateMagicItemDto): Promise<MagicItemWithType> {
    const existing = await magicItemRepository.findMagicItemByName(data.name);
    if (existing) {
      throw new ApiError(409, 'Magic item with this name already exists');
    }

    const type = await magicItemRepository.findMagicItemTypeById(data.typeId);
    if (!type) {
      throw new ApiError(404, `Magic item type with ID ${data.typeId} not found`);
    }

    return magicItemRepository.createMagicItem(data);
  }

  async updateMagicItem(
    id: number,
    data: UpdateMagicItemDto
  ): Promise<MagicItemWithType> {
    const item = await magicItemRepository.findMagicItemById(id);
    if (!item) {
      throw new ApiError(404, 'Magic item not found');
    }

    if (data.name && data.name !== item.name) {
      const conflict = await magicItemRepository.findMagicItemByName(data.name);
      if (conflict) {
        throw new ApiError(409, 'Magic item with this name already exists');
      }
    }

    if (data.typeId !== undefined && data.typeId !== item.typeId) {
      const type = await magicItemRepository.findMagicItemTypeById(data.typeId);
      if (!type) {
        throw new ApiError(
          404,
          `Magic item type with ID ${data.typeId} not found`
        );
      }
    }

    return magicItemRepository.updateMagicItem(id, data);
  }

  async deleteMagicItem(id: number): Promise<MagicItem> {
    const item = await magicItemRepository.findMagicItemById(id);
    if (!item) {
      throw new ApiError(404, 'Magic item not found');
    }

    return magicItemRepository.deleteMagicItem(id);
  }

  // ============================================
  // MAGIC ITEM TYPES
  // ============================================

  async getAllMagicItemTypes(
    options?: GetAllMagicItemTypesOptions
  ): Promise<{ types: MagicItemType[]; count: number }> {
    return magicItemRepository.findAllMagicItemTypes(options);
  }

  async getMagicItemTypeById(id: number): Promise<MagicItemType> {
    const type = await magicItemRepository.findMagicItemTypeById(id);
    if (!type) {
      throw new ApiError(404, 'Magic item type not found');
    }
    return type;
  }

  async createMagicItemType(
    data: CreateMagicItemTypeDto
  ): Promise<MagicItemType> {
    const existing = await magicItemRepository.findMagicItemTypeByName(
      data.name
    );
    if (existing) {
      throw new ApiError(409, 'Magic item type with this name already exists');
    }

    return magicItemRepository.createMagicItemType(data);
  }

  async updateMagicItemType(
    id: number,
    data: UpdateMagicItemTypeDto
  ): Promise<MagicItemType> {
    const type = await magicItemRepository.findMagicItemTypeById(id);
    if (!type) {
      throw new ApiError(404, 'Magic item type not found');
    }

    if (data.name && data.name !== type.name) {
      const conflict = await magicItemRepository.findMagicItemTypeByName(
        data.name
      );
      if (conflict) {
        throw new ApiError(
          409,
          'Magic item type with this name already exists'
        );
      }
    }

    return magicItemRepository.updateMagicItemType(id, data);
  }

  async deleteMagicItemType(id: number): Promise<MagicItemType> {
    const type = await magicItemRepository.findMagicItemTypeById(id);
    if (!type) {
      throw new ApiError(404, 'Magic item type not found');
    }

    try {
      return await magicItemRepository.deleteMagicItemType(id);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code?: string }).code === 'P2003'
      ) {
        throw new ApiError(
          409,
          'Cannot delete a magic item type that is still in use'
        );
      }
      throw error;
    }
  }
}

export default new MagicItemService();
