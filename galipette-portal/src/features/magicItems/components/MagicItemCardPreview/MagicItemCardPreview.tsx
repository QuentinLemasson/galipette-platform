/**
 * @fileOverview Renders a single magic-item card via the shared PDF utility.
 *
 * Lazily produces the rendered PNG using the same drawing pipeline as the
 * exported PDF, so the in-app preview matches the printed result exactly.
 */
import { Typography } from '@/common/components';
import type { MagicItemCardSource } from '../../utils/magic-items-pdf.util';
import { useMagicItemCardPreview } from '../../hooks/useMagicItemCardPreview';

interface MagicItemCardPreviewProps {
  item: MagicItemCardSource;
  className?: string;
}

/**
 * Renders the magic item as a card preview image.
 */
export const MagicItemCardPreview = ({
  item,
  className,
}: MagicItemCardPreviewProps) => {
  const { previewUrl, isLoading } = useMagicItemCardPreview(item);

  return (
    <div
      className={`bg-muted relative w-full overflow-hidden rounded-lg border ${className ?? ''}`}
      style={{ aspectRatio: '200 / 280' }}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`Apercu de ${item.name}`}
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Typography
            variant="caption"
            className="text-muted-foreground"
          >
            {isLoading ? 'Generation de l apercu...' : 'Apercu indisponible'}
          </Typography>
        </div>
      )}
    </div>
  );
};
