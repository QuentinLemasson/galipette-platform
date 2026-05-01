/**
 * @fileOverview Express controllers for MagicItem and MagicItemType endpoints.
 *
 * Validation is delegated to the shared Zod schemas; service-level errors are
 * surfaced as ApiError 4xx responses.
 */
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createMagicItemSchema,
  updateMagicItemSchema,
  magicItemIdSchema,
  createMagicItemTypeSchema,
  updateMagicItemTypeSchema,
  magicItemTypeIdSchema,
} from '@galipette/shared';
import magicItemService from './magicItem.service';
import {
  mapToMagicItemDto,
  mapToMagicItemTypeDto,
} from './magicItem.model';
import {
  formatSuccess,
  formatError,
  formatZodErrors,
} from '../../utils/responseFormatter';
import { parseIdsParam, parsePaginationParams } from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';

/**
 * Convert any thrown error into an HTTP response. Centralised here to avoid
 * duplicated try/catch boilerplate in every handler.
 */
const sendError = (res: Response, error: unknown, fallback: string): void => {
  if (error instanceof ZodError) {
    res
      .status(400)
      .json(formatError('Validation failed', formatZodErrors(error.issues)));
    return;
  }
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(formatError(error.message));
    return;
  }
  res.status(500).json(formatError(fallback));
};

export class MagicItemController {
  // ============================================
  // MAGIC ITEMS
  // ============================================

  async getAllMagicItems(req: Request, res: Response): Promise<void> {
    try {
      const ids = parseIdsParam(req.query.ids as string | undefined);
      const typeIds = parseIdsParam(req.query.typeIds as string | undefined);
      const search =
        typeof req.query.search === 'string' ? req.query.search : undefined;
      const { skip, take } = parsePaginationParams(
        req.query.page as string | undefined,
        req.query.limit as string | undefined
      );

      const options: {
        skip: number;
        take: number;
        ids?: number[];
        typeIds?: number[];
        search?: string;
      } = { skip, take };
      if (ids) options.ids = ids;
      if (typeIds) options.typeIds = typeIds;
      if (search) options.search = search;

      const { items, count } = await magicItemService.getAllMagicItems(options);
      const dtos = items.map(mapToMagicItemDto);

      res.status(200).json(
        formatSuccess(dtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        })
      );
    } catch (error) {
      sendError(res, error, 'Failed to retrieve magic items');
    }
  }

  async getMagicItemById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = magicItemIdSchema.parse({ id: req.params.id });
      const item = await magicItemService.getMagicItemById(id);
      res.status(200).json(formatSuccess(mapToMagicItemDto(item)));
    } catch (error) {
      sendError(res, error, 'Failed to retrieve magic item');
    }
  }

  async createMagicItem(req: Request, res: Response): Promise<void> {
    try {
      const data = createMagicItemSchema.parse(req.body);
      const item = await magicItemService.createMagicItem(data);
      res.status(201).json(formatSuccess(mapToMagicItemDto(item)));
    } catch (error) {
      sendError(res, error, 'Failed to create magic item');
    }
  }

  async updateMagicItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = magicItemIdSchema.parse({ id: req.params.id });
      const data = updateMagicItemSchema.parse(req.body);
      const item = await magicItemService.updateMagicItem(id, data);
      res.status(200).json(formatSuccess(mapToMagicItemDto(item)));
    } catch (error) {
      sendError(res, error, 'Failed to update magic item');
    }
  }

  async deleteMagicItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = magicItemIdSchema.parse({ id: req.params.id });
      await magicItemService.deleteMagicItem(id);
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete magic item');
    }
  }

  // ============================================
  // MAGIC ITEM TYPES
  // ============================================

  async getAllMagicItemTypes(req: Request, res: Response): Promise<void> {
    try {
      const ids = parseIdsParam(req.query.ids as string | undefined);
      const { skip, take } = parsePaginationParams(
        req.query.page as string | undefined,
        req.query.limit as string | undefined
      );

      const options: { skip: number; take: number; ids?: number[] } = {
        skip,
        take,
      };
      if (ids) options.ids = ids;

      const { types, count } =
        await magicItemService.getAllMagicItemTypes(options);
      const dtos = types.map(mapToMagicItemTypeDto);

      res.status(200).json(
        formatSuccess(dtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        })
      );
    } catch (error) {
      sendError(res, error, 'Failed to retrieve magic item types');
    }
  }

  async getMagicItemTypeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = magicItemTypeIdSchema.parse({ id: req.params.id });
      const type = await magicItemService.getMagicItemTypeById(id);
      res.status(200).json(formatSuccess(mapToMagicItemTypeDto(type)));
    } catch (error) {
      sendError(res, error, 'Failed to retrieve magic item type');
    }
  }

  async createMagicItemType(req: Request, res: Response): Promise<void> {
    try {
      const data = createMagicItemTypeSchema.parse(req.body);
      const type = await magicItemService.createMagicItemType(data);
      res.status(201).json(formatSuccess(mapToMagicItemTypeDto(type)));
    } catch (error) {
      sendError(res, error, 'Failed to create magic item type');
    }
  }

  async updateMagicItemType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = magicItemTypeIdSchema.parse({ id: req.params.id });
      const data = updateMagicItemTypeSchema.parse(req.body);
      const type = await magicItemService.updateMagicItemType(id, data);
      res.status(200).json(formatSuccess(mapToMagicItemTypeDto(type)));
    } catch (error) {
      sendError(res, error, 'Failed to update magic item type');
    }
  }

  async deleteMagicItemType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = magicItemTypeIdSchema.parse({ id: req.params.id });
      await magicItemService.deleteMagicItemType(id);
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete magic item type');
    }
  }
}

export default new MagicItemController();
