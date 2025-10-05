import { useState, useCallback } from 'react';
import { campaignsService } from '../services';
import type {
  CreateCampaignDto,
  UpdateCampaignDto,
  AddPlayerToCampaignDto,
  CampaignResponseDto,
} from '@galipette/shared';

interface MutationState<T> {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  data: T | null;
}

interface MutationCallbacks<TData, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export const useCampaignMutations = () => {
  const [createState, setCreateState] = useState<
    MutationState<CampaignResponseDto>
  >({
    isPending: false,
    isError: false,
    error: null,
    data: null,
  });

  const [updateState, setUpdateState] = useState<
    MutationState<CampaignResponseDto>
  >({
    isPending: false,
    isError: false,
    error: null,
    data: null,
  });

  const [deleteState, setDeleteState] = useState<MutationState<void>>({
    isPending: false,
    isError: false,
    error: null,
    data: null,
  });

  const [addPlayerState, setAddPlayerState] = useState<MutationState<void>>({
    isPending: false,
    isError: false,
    error: null,
    data: null,
  });

  const [removePlayerState, setRemovePlayerState] = useState<
    MutationState<void>
  >({
    isPending: false,
    isError: false,
    error: null,
    data: null,
  });

  const createCampaign = useCallback(
    async (
      data: CreateCampaignDto,
      callbacks?: MutationCallbacks<CampaignResponseDto>
    ) => {
      try {
        setCreateState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        const result = await campaignsService.create(data);
        setCreateState({
          isPending: false,
          isError: false,
          error: null,
          data: result,
        });
        callbacks?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to create campaign');
        setCreateState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const updateCampaign = useCallback(
    async (
      { id, data }: { id: number; data: UpdateCampaignDto },
      callbacks?: MutationCallbacks<CampaignResponseDto>
    ) => {
      try {
        setUpdateState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        const result = await campaignsService.update(id, data);
        setUpdateState({
          isPending: false,
          isError: false,
          error: null,
          data: result,
        });
        callbacks?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to update campaign');
        setUpdateState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const deleteCampaign = useCallback(
    async (id: number, callbacks?: MutationCallbacks<void>) => {
      try {
        setDeleteState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        await campaignsService.delete(id);
        setDeleteState({
          isPending: false,
          isError: false,
          error: null,
          data: null,
        });
        callbacks?.onSuccess?.(undefined);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to delete campaign');
        setDeleteState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const addPlayer = useCallback(
    async (
      {
        campaignId,
        playerData,
      }: { campaignId: number; playerData: AddPlayerToCampaignDto },
      callbacks?: MutationCallbacks<void>
    ) => {
      try {
        setAddPlayerState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        await campaignsService.addPlayer(campaignId, playerData);
        setAddPlayerState({
          isPending: false,
          isError: false,
          error: null,
          data: null,
        });
        callbacks?.onSuccess?.(undefined);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to add player');
        setAddPlayerState({
          isPending: false,
          isError: true,
          error,
          data: null,
        });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const removePlayer = useCallback(
    async (
      { campaignId, userId }: { campaignId: number; userId: number },
      callbacks?: MutationCallbacks<void>
    ) => {
      try {
        setRemovePlayerState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        await campaignsService.removePlayer(campaignId, userId);
        setRemovePlayerState({
          isPending: false,
          isError: false,
          error: null,
          data: null,
        });
        callbacks?.onSuccess?.(undefined);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to remove player');
        setRemovePlayerState({
          isPending: false,
          isError: true,
          error,
          data: null,
        });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  return {
    createCampaign: {
      mutate: createCampaign,
      mutateAsync: createCampaign,
      ...createState,
    },
    updateCampaign: {
      mutate: updateCampaign,
      mutateAsync: updateCampaign,
      ...updateState,
    },
    deleteCampaign: {
      mutate: deleteCampaign,
      mutateAsync: deleteCampaign,
      ...deleteState,
    },
    addPlayer: {
      mutate: addPlayer,
      mutateAsync: addPlayer,
      ...addPlayerState,
    },
    removePlayer: {
      mutate: removePlayer,
      mutateAsync: removePlayer,
      ...removePlayerState,
    },
  };
};
