/**
 * @fileOverview Card component used in the magic-items listing grid.
 *
 * Shows the item's image (or a placeholder), name, type and a clamped
 * description preview, plus quick action buttons (Preview / Edit / Delete).
 */
import { Link } from 'react-router-dom';
import type { MagicItemResponseDto } from '@galipette/shared';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/common/ui';
import { Typography } from '@/common/components';
import { PAGES } from '@/app/routes/config/pages';

interface MagicItemCardProps {
  item: MagicItemResponseDto;
  onPreview?: (item: MagicItemResponseDto) => void;
  onDelete?: (item: MagicItemResponseDto) => void;
}

/**
 * Single magic item entry in the listing grid.
 */
export const MagicItemCard = ({
  item,
  onPreview,
  onDelete,
}: MagicItemCardProps) => {
  const detailsPath =
    PAGES.MAGIC_ITEM_DETAILS.build?.({
      magicItemId: item.id.toString(),
    }) ?? `/magic-items/${item.id}`;
  const editPath =
    PAGES.MAGIC_ITEM_EDIT.build?.({
      magicItemId: item.id.toString(),
    }) ?? `/magic-items/${item.id}/edit`;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="bg-muted relative aspect-[4/3] overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs">
            image a venir
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="line-clamp-1">{item.name}</CardTitle>
          <Badge variant="secondary">{item.type.name}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <Typography variant="body-sm" className="line-clamp-3">
          {item.description}
        </Typography>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to={detailsPath}
          className="text-primary text-sm font-medium hover:underline"
        >
          Voir details
        </Link>
        <div className="flex items-center gap-2">
          {onPreview && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onPreview(item)}
            >
              Apercu
            </Button>
          )}
          <Link to={editPath}>
            <Button type="button" size="sm" variant="outline">
              Editer
            </Button>
          </Link>
          {onDelete && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onDelete(item)}
            >
              Supprimer
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
