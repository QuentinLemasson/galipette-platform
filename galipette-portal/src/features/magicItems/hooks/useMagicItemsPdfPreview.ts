/**
 * @fileOverview Generates the first-page PNG preview for a batch export.
 */
import { useEffect, useState } from 'react';
import {
  getMagicItemsPdfPreviewDataUrl,
  type MagicItemCardSource,
} from '../utils/magic-items-pdf.util';

interface UseMagicItemsPdfPreviewResult {
  previewUrl: string | null;
  isLoading: boolean;
}

const buildPreviewSignature = (
  items: readonly MagicItemCardSource[]
): string =>
  items
    .map(
      item =>
        `${item.id}:${item.name}:${item.description}:${item.image ?? ''}:${item.type.name}`
    )
    .join('|');

export const useMagicItemsPdfPreview = (
  items: readonly MagicItemCardSource[]
): UseMagicItemsPdfPreviewResult => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signature = buildPreviewSignature(items);

  useEffect(() => {
    if (items.length === 0) {
      setPreviewUrl(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    getMagicItemsPdfPreviewDataUrl({ items })
      .then(url => {
        if (!cancelled) setPreviewUrl(url);
      })
      .catch(() => {
        if (!cancelled) setPreviewUrl(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [signature]);

  return { previewUrl, isLoading };
};
