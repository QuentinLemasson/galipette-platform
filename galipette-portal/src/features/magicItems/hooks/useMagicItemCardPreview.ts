/**
 * @fileOverview Generates the PNG data URL for a single magic-item card preview.
 */
import { useEffect, useState } from 'react';
import {
  getMagicItemCardPreviewDataUrl,
  type MagicItemCardSource,
} from '../utils/magic-items-pdf.util';

interface UseMagicItemCardPreviewResult {
  previewUrl: string | null;
  isLoading: boolean;
}

const cardSignature = (item: MagicItemCardSource): string =>
  `${item.id}:${item.name}:${item.description}:${item.image ?? ''}:${item.type.name}`;

export const useMagicItemCardPreview = (
  item: MagicItemCardSource
): UseMagicItemCardPreviewResult => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signature = cardSignature(item);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setPreviewUrl(null);

    getMagicItemCardPreviewDataUrl({ item })
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
