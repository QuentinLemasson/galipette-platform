import { useState, useEffect, useCallback } from 'react';
import { campaignsService } from '../services';
import type { CampaignPlayerDto } from '@galipette/shared';

export const useCampaignPlayers = (campaignId: number | undefined) => {
  const [data, setData] = useState<CampaignPlayerDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlayers = useCallback(async () => {
    if (!campaignId) return;

    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const players = await campaignsService.getPlayers(campaignId);
      setData(players);
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch players')
      );
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchPlayers,
  };
};
