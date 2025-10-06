import { useState, useEffect, useCallback } from 'react';
import { ancestriesService } from '../services';
import type { AncestryResponseDto } from '@galipette/shared';

export const useAncestry = (id: number | undefined) => {
  const [data, setData] = useState<AncestryResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAncestry = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const ancestry = await ancestriesService.getById(id);
      setData(ancestry);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch ancestry')
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAncestry();
  }, [fetchAncestry]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchAncestry,
  };
};
