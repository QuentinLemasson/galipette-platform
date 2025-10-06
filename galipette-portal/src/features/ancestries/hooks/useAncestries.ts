import { useState, useEffect, useCallback } from 'react';
import { ancestriesService } from '../services';
import type { AncestryResponseDto } from '@galipette/shared';

interface UseAncestriesOptions {
  page?: number;
  limit?: number;
}

export const useAncestries = (options?: UseAncestriesOptions) => {
  const [data, setData] = useState<AncestryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAncestries = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const { ancestries } = await ancestriesService.getAll(options);
      setData(ancestries);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch ancestries')
      );
    } finally {
      setIsLoading(false);
    }
  }, [options?.page, options?.limit]);

  useEffect(() => {
    fetchAncestries();
  }, [fetchAncestries]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchAncestries,
  };
};
