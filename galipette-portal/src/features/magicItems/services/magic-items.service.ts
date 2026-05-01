/**
 * @fileOverview Service for the /api/magic-items REST endpoints.
 *
 * Performs client-side Zod validation before sending mutations and returns
 * typed DTOs from `@galipette/shared`.
 */
import apiClient from '@/common/services/api-client';
import {
  type MagicItemResponseDto,
  type CreateMagicItemDto,
  type UpdateMagicItemDto,
  createMagicItemSchema,
  updateMagicItemSchema,
} from '@galipette/shared';

/** API success envelope returned by the backend. */
interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/** Filters accepted by the listing endpoint. */
export interface GetMagicItemsParams {
  page?: number;
  limit?: number;
  search?: string;
  typeIds?: number[];
}

const buildListParams = (
  params?: GetMagicItemsParams
): Record<string, string | number> | undefined => {
  if (!params) return undefined;

  const out: Record<string, string | number> = {};
  if (params.page !== undefined) out.page = params.page;
  if (params.limit !== undefined) out.limit = params.limit;
  if (params.search) out.search = params.search;
  if (params.typeIds && params.typeIds.length > 0) {
    out.typeIds = params.typeIds.join(',');
  }
  return out;
};

export const magicItemsService = {
  /**
   * List magic items with optional filters and pagination.
   */
  async getAll(
    params?: GetMagicItemsParams
  ): Promise<{
    items: MagicItemResponseDto[];
    meta: ApiSuccessResponse<MagicItemResponseDto[]>['meta'];
  }> {
    const response = await apiClient.get<
      ApiSuccessResponse<MagicItemResponseDto[]>
    >('/magic-items', { params: buildListParams(params) });

    return {
      items: response.data.data,
      meta: response.data.meta,
    };
  },

  async getById(id: number): Promise<MagicItemResponseDto> {
    const response = await apiClient.get<
      ApiSuccessResponse<MagicItemResponseDto>
    >(`/magic-items/${id}`);
    return response.data.data;
  },

  async create(data: CreateMagicItemDto): Promise<MagicItemResponseDto> {
    const validated = createMagicItemSchema.parse(data);
    const response = await apiClient.post<
      ApiSuccessResponse<MagicItemResponseDto>
    >('/magic-items', validated);
    return response.data.data;
  },

  async update(
    id: number,
    data: UpdateMagicItemDto
  ): Promise<MagicItemResponseDto> {
    const validated = updateMagicItemSchema.parse(data);
    const response = await apiClient.patch<
      ApiSuccessResponse<MagicItemResponseDto>
    >(`/magic-items/${id}`, validated);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/magic-items/${id}`);
  },
};

export default magicItemsService;
