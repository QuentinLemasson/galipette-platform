/**
 * @fileOverview Manages checkbox selection for the PDF export dialog.
 *
 * When the dialog opens, all supplied items start selected; callers can
 * toggle individual rows before confirming the export.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MagicItemResponseDto } from '@galipette/shared';

interface UseMagicItemExportSelectionResult {
  selectedIds: Set<number>;
  toggleId: (id: number) => void;
  selectedItems: MagicItemResponseDto[];
}

export const useMagicItemExportSelection = (
  open: boolean,
  items: MagicItemResponseDto[]
): UseMagicItemExportSelectionResult => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const listSignature = useMemo(
    () => items.map(item => item.id).join(','),
    [items]
  );

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  }, [open, listSignature]);

  const toggleId = useCallback((id: number) => {
    setSelectedIds(previous => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedItems = useMemo(
    () => items.filter(item => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  return { selectedIds, toggleId, selectedItems };
};
