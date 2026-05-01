/**
 * @fileOverview Magic items listing with filters, CRUD shortcuts and PDF export.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MagicItemResponseDto } from '@galipette/shared';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/ui';
import { ErrorBlock, Typography } from '@/common/components';
import { PAGES } from '@/app/routes/config/pages';
import {
  useMagicItems,
  useMagicItemMutations,
  useMagicItemTypes,
} from '../hooks';
import {
  MagicItemCard,
  MagicItemExportDialog,
  MagicItemFilters,
  MagicItemCardPreview,
} from '../components';

export default function MagicItemsListPage() {
  const [search, setSearch] = useState('');
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MagicItemResponseDto | null>(
    null
  );
  const [deleteItem, setDeleteItem] = useState<MagicItemResponseDto | null>(
    null
  );

  const { data: items, isLoading, error, refetch } = useMagicItems({
    search: search.length > 0 ? search : undefined,
    typeIds: selectedTypeIds.length > 0 ? selectedTypeIds : undefined,
    limit: 100,
  });

  const {
    data: types,
    isLoading: isLoadingTypes,
    error: typesError,
  } = useMagicItemTypes();

  const { deleteMagicItem } = useMagicItemMutations();

  const filteredItems = useMemo(() => items ?? [], [items]);

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteItem) return;

    try {
      await deleteMagicItem.mutateAsync(deleteItem.id, {
        onSuccess: () => {
          setDeleteItem(null);
          void refetch();
        },
      });
    } catch {
      /* mutation surfaces its own error state */
    }
  };

  const previewCardSource = previewItem
    ? {
        id: previewItem.id,
        name: previewItem.name,
        description: previewItem.description,
        image: previewItem.image,
        type: { name: previewItem.type.name },
      }
    : null;

  if (error || typesError) {
    return (
      <section className="container mx-auto p-6">
        <ErrorBlock
          message={error?.message ?? typesError?.message ?? 'Erreur'}
          title="Erreur"
        />
      </section>
    );
  }

  return (
    <section className="container mx-auto space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Typography variant="h1" className="text-2xl font-bold">
            Objets magiques
          </Typography>
          <Typography variant="muted" className="mt-1">
            Gestion des objets magiques et export cartes PDF.
          </Typography>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={() => setIsExportOpen(true)}>
            Exporter en PDF
          </Button>
          <Link to={PAGES.MAGIC_ITEM_CREATE.path}>
            <Button type="button">+ Creer</Button>
          </Link>
        </div>
      </div>

      <MagicItemFilters
        search={search}
        onSearchChange={setSearch}
        types={types}
        selectedTypeIds={selectedTypeIds}
        onSelectedTypeIdsChange={setSelectedTypeIds}
        isLoadingTypes={isLoadingTypes}
      />

      {isLoading ? (
        <Typography variant="body-sm" className="text-muted-foreground">
          Chargement...
        </Typography>
      ) : filteredItems.length === 0 ? (
        <div className="bg-muted/40 rounded-lg border p-8 text-center">
          <Typography variant="body-sm" className="text-muted-foreground">
            Aucun objet ne correspond aux filtres.
          </Typography>
          <Link
            to={PAGES.MAGIC_ITEM_CREATE.path}
            className="mt-4 inline-block"
          >
            <Button type="button" variant="outline">
              Creer le premier objet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <MagicItemCard
              key={item.id}
              item={item}
              onPreview={setPreviewItem}
              onDelete={setDeleteItem}
            />
          ))}
        </div>
      )}

      <MagicItemExportDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        filteredItems={filteredItems}
      />

      <Dialog
        open={previewItem !== null}
        onOpenChange={open => {
          if (!open) setPreviewItem(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apercu carte</DialogTitle>
          </DialogHeader>
          {previewCardSource && (
            <MagicItemCardPreview item={previewCardSource} />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPreviewItem(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteItem !== null}
        onOpenChange={open => {
          if (!open) setDeleteItem(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cet objet ?</DialogTitle>
          </DialogHeader>
          <Typography variant="body-sm">
            {deleteItem
              ? `Supprimer definitivement « ${deleteItem.name} » ?`
              : ''}
          </Typography>
          {deleteMagicItem.error && (
            <ErrorBlock message={deleteMagicItem.error.message} />
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteItem(null)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMagicItem.isPending}
              onClick={handleConfirmDelete}
            >
              {deleteMagicItem.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
