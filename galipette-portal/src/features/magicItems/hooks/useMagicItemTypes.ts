/**
 * @fileOverview Custom hook fetching all magic item types.
 *
 * Used by filters and the create/edit form to populate the type selector.
 */
import { useState, useEffect, useCallback } from 'react';
import { magicItemTypesService } from '../services';
import type { MagicItemTypeResponseDto } from '@galipette/shared';

export const useMagicItemTypes = () => {
  const [data, setData] = useState<MagicItemTypeResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const types = await magicItemTypesService.getAll();
      setData(types);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch magic item types')
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchTypes,
  };
};
