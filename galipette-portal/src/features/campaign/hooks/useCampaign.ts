import { useState, useEffect, useCallback } from 'react';
import { campaignsService } from '../services';
import type { CampaignResponseDto } from '@galipette/shared';

export const useCampaign = (campaignId: number | undefined) => {
  const [data, setData] = useState<CampaignResponseDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return;

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const campaign = await campaignsService.getById(campaignId);
      setData(campaign);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch campaign')
      );
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchCampaign,
  };
};
