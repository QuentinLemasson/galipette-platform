import { useState, useCallback } from 'react';
import { ancestriesService } from '../services';
import type {
  CreateAncestryDto,
  UpdateAncestryDto,
  AncestryResponseDto,
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

export const useAncestryMutations = () => {
  const [createState, setCreateState] = useState<
    MutationState<AncestryResponseDto>
  >({
    isPending: false,
    isError: false,
    error: null,
    data: null,
  });

  const [updateState, setUpdateState] = useState<
    MutationState<AncestryResponseDto>
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

  const createAncestry = useCallback(
    async (
      data: CreateAncestryDto,
      callbacks?: MutationCallbacks<AncestryResponseDto>
    ) => {
      try {
        setCreateState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        const result = await ancestriesService.create(data);
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
          err instanceof Error ? err : new Error('Failed to create ancestry');
        setCreateState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const updateAncestry = useCallback(
    async (
      { id, data }: { id: number; data: UpdateAncestryDto },
      callbacks?: MutationCallbacks<AncestryResponseDto>
    ) => {
      try {
        setUpdateState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        const result = await ancestriesService.update(id, data);
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
          err instanceof Error ? err : new Error('Failed to update ancestry');
        setUpdateState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const deleteAncestry = useCallback(
    async (id: number, callbacks?: MutationCallbacks<void>) => {
      try {
        setDeleteState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        await ancestriesService.delete(id);
        setDeleteState({
          isPending: false,
          isError: false,
          error: null,
          data: null,
        });
        callbacks?.onSuccess?.(undefined);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to delete ancestry');
        setDeleteState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  return {
    createAncestry: {
      mutate: createAncestry,
      mutateAsync: createAncestry,
      ...createState,
    },
    updateAncestry: {
      mutate: updateAncestry,
      mutateAsync: updateAncestry,
      ...updateState,
    },
    deleteAncestry: {
      mutate: deleteAncestry,
      mutateAsync: deleteAncestry,
      ...deleteState,
    },
  };
};
