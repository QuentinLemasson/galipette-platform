import { useState, useEffect, useCallback } from 'react';
import { campaignsService } from '../services';
import type { CampaignResponseDto } from '@galipette/shared';

interface UseCampaignsOptions {
  playerId?: number;
  page?: number;
  limit?: number;
}

export const useCampaigns = (options?: UseCampaignsOptions) => {
  const [data, setData] = useState<CampaignResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const { campaigns } = await campaignsService.getAll(options);
      setData(campaigns);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch campaigns')
      );
    } finally {
      setIsLoading(false);
    }
  }, [options?.playerId, options?.page, options?.limit]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchCampaigns,
  };
};
