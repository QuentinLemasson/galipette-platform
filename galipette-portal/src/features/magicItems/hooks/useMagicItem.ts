/**
 * @fileOverview Custom hook loading a single magic item by ID.
 */
import { useState, useEffect, useCallback } from 'react';
import { magicItemsService } from '../services';
import type { MagicItemResponseDto } from '@galipette/shared';

export const useMagicItem = (id: number | undefined) => {
  const [data, setData] = useState<MagicItemResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItem = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const item = await magicItemsService.getById(id);
      setData(item);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch magic item')
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchItem,
  };
};
