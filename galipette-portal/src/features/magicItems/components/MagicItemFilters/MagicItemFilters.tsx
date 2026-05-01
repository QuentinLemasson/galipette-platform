/**
 * @fileOverview Filters for the magic items listing.
 *
 * Combines a free-text search input and a list of toggle-able type chips.
 * Selection is fully controlled by the parent screen so filters can also
 * drive the PDF export dialog.
 */
import { Badge, Button, Input } from '@/common/ui';
import { Typography } from '@/common/components';
import type { MagicItemTypeResponseDto } from '@galipette/shared';

interface MagicItemFiltersProps {
  search: string;
  onSearchChange: (next: string) => void;
  types: MagicItemTypeResponseDto[];
  selectedTypeIds: number[];
  onSelectedTypeIdsChange: (next: number[]) => void;
  isLoadingTypes?: boolean;
}

const toggleId = (current: number[], id: number): number[] =>
  current.includes(id) ? current.filter(value => value !== id) : [...current, id];

/**
 * Search + type-chip filter bar.
 */
export const MagicItemFilters = ({
  search,
  onSearchChange,
  types,
  selectedTypeIds,
  onSelectedTypeIdsChange,
  isLoadingTypes,
}: MagicItemFiltersProps) => {
  const hasFilters = search.length > 0 || selectedTypeIds.length > 0;

  const clearAll = (): void => {
    onSearchChange('');
    onSelectedTypeIdsChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={search}
          placeholder="Rechercher par nom..."
          onChange={event => onSearchChange(event.target.value)}
          className="max-w-sm"
        />
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
          >
            Reinitialiser les filtres
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Typography variant="caption" className="text-muted-foreground">
          Types
        </Typography>
        {isLoadingTypes && types.length === 0 ? (
          <Typography variant="caption" className="text-muted-foreground">
            Chargement...
          </Typography>
        ) : types.length === 0 ? (
          <Typography variant="caption" className="text-muted-foreground">
            Aucun type defini
          </Typography>
        ) : (
          types.map(type => {
            const isActive = selectedTypeIds.includes(type.id);
            return (
              <Badge
                key={type.id}
                variant={isActive ? 'default' : 'outline'}
                className="cursor-pointer select-none"
                onClick={() =>
                  onSelectedTypeIdsChange(toggleId(selectedTypeIds, type.id))
                }
              >
                {type.name}
              </Badge>
            );
          })
        )}
      </div>
    </div>
  );
};
