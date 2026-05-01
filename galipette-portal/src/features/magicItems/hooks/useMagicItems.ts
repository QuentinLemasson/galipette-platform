/**
 * @fileOverview Custom hook fetching the magic-items list with filter support.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  magicItemsService,
  type GetMagicItemsParams,
} from '../services';
import type { MagicItemResponseDto } from '@galipette/shared';

interface UseMagicItemsResult {
  data: MagicItemResponseDto[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Loads the list of magic items with the supplied filters.
 *
 * Re-fetches whenever the search string or selected typeIds change.
 */
export const useMagicItems = (
  options?: GetMagicItemsParams
): UseMagicItemsResult => {
  const [data, setData] = useState<MagicItemResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = options?.search;
  const typeIdsKey = [...(options?.typeIds ?? [])]
    .sort((a, b) => a - b)
    .join(',');
  const page = options?.page;
  const limit = options?.limit;

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const { items } = await magicItemsService.getAll({
        search,
        typeIds: typeIdsKey
          ? typeIdsKey.split(',').map(Number)
          : undefined,
        page,
        limit,
      });
      setData(items);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch magic items')
      );
    } finally {
      setIsLoading(false);
    }
  }, [search, typeIdsKey, page, limit]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchItems,
  };
};
