/**
 * @fileOverview Mutation hooks for create/update/delete on magic items.
 */
import { useState, useCallback } from 'react';
import { magicItemsService } from '../services';
import type {
  CreateMagicItemDto,
  UpdateMagicItemDto,
  MagicItemResponseDto,
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

const initialState = <T,>(): MutationState<T> => ({
  isPending: false,
  isError: false,
  error: null,
  data: null,
});

export const useMagicItemMutations = () => {
  const [createState, setCreateState] = useState<
    MutationState<MagicItemResponseDto>
  >(initialState);
  const [updateState, setUpdateState] = useState<
    MutationState<MagicItemResponseDto>
  >(initialState);
  const [deleteState, setDeleteState] =
    useState<MutationState<void>>(initialState);

  const createMagicItem = useCallback(
    async (
      data: CreateMagicItemDto,
      callbacks?: MutationCallbacks<MagicItemResponseDto>
    ) => {
      try {
        setCreateState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        const result = await magicItemsService.create(data);
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
          err instanceof Error ? err : new Error('Failed to create magic item');
        setCreateState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const updateMagicItem = useCallback(
    async (
      { id, data }: { id: number; data: UpdateMagicItemDto },
      callbacks?: MutationCallbacks<MagicItemResponseDto>
    ) => {
      try {
        setUpdateState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        const result = await magicItemsService.update(id, data);
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
          err instanceof Error ? err : new Error('Failed to update magic item');
        setUpdateState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  const deleteMagicItem = useCallback(
    async (id: number, callbacks?: MutationCallbacks<void>) => {
      try {
        setDeleteState({
          isPending: true,
          isError: false,
          error: null,
          data: null,
        });
        await magicItemsService.delete(id);
        setDeleteState({
          isPending: false,
          isError: false,
          error: null,
          data: null,
        });
        callbacks?.onSuccess?.(undefined);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to delete magic item');
        setDeleteState({ isPending: false, isError: true, error, data: null });
        callbacks?.onError?.(error);
        throw error;
      }
    },
    []
  );

  return {
    createMagicItem: {
      mutate: createMagicItem,
      mutateAsync: createMagicItem,
      ...createState,
    },
    updateMagicItem: {
      mutate: updateMagicItem,
      mutateAsync: updateMagicItem,
      ...updateState,
    },
    deleteMagicItem: {
      mutate: deleteMagicItem,
      mutateAsync: deleteMagicItem,
      ...deleteState,
    },
  };
};
