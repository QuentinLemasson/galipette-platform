/**
 * @fileOverview Modal allowing users to export the currently filtered magic
 * items to a landscape PDF. Items start selected; rows can be unchecked.
 */
import { useMemo, useState } from 'react';
import type { MagicItemResponseDto } from '@galipette/shared';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from '@/common/ui';
import { Typography } from '@/common/components';
import {
  CARDS_PER_PAGE,
  downloadMagicItemsLandscapePdf,
} from '../../utils/magic-items-pdf.util';
import { useMagicItemExportSelection } from '../../hooks/useMagicItemExportSelection';
import { useMagicItemsPdfPreview } from '../../hooks/useMagicItemsPdfPreview';

interface MagicItemExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Items matching the parent page filters (starting selection = all). */
  filteredItems: MagicItemResponseDto[];
}

/**
 * Export dialog with per-row selection and first-page PNG preview.
 */
export const MagicItemExportDialog = ({
  open,
  onOpenChange,
  filteredItems,
}: MagicItemExportDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const { selectedIds, toggleId, selectedItems } = useMagicItemExportSelection(
    open,
    filteredItems
  );

  const previewSources = useMemo(
    () =>
      selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        type: { name: item.type.name },
      })),
    [selectedItems]
  );

  const { previewUrl, isLoading: isPreviewLoading } =
    useMagicItemsPdfPreview(previewSources);

  const totalSelected = selectedItems.length;
  const pdfPageCount =
    totalSelected === 0 ? 0 : Math.ceil(totalSelected / CARDS_PER_PAGE);

  const exportToPdf = async (): Promise<void> => {
    if (previewSources.length === 0) return;

    setIsExporting(true);
    try {
      await downloadMagicItemsLandscapePdf({
        items: previewSources,
        fileName: `magic-items-export-${new Date().toISOString().slice(0, 10)}.pdf`,
      });
      onOpenChange(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exporter en PDF</DialogTitle>
          <DialogDescription>
            Les objets correspondent aux filtres actifs. Decochez ceux a exclure.
            PDF paysage : grille 4 x 2 ({CARDS_PER_PAGE} cartes par page).
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[280px] space-y-3 overflow-auto pr-1">
          {filteredItems.length === 0 ? (
            <Typography variant="caption" className="text-muted-foreground">
              Aucun objet ne correspond aux filtres.
            </Typography>
          ) : (
            filteredItems.map(item => {
              const checked = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`magic-item-export-${item.id}`}
                      checked={checked}
                      onCheckedChange={() => toggleId(item.id)}
                    />
                    <Label
                      htmlFor={`magic-item-export-${item.id}`}
                      className="cursor-pointer"
                    >
                      {item.name}
                    </Label>
                  </div>
                  <Typography variant="caption" className="text-muted-foreground">
                    {item.type.name}
                  </Typography>
                </div>
              );
            })
          )}
        </div>

        {totalSelected > 0 && (
          <div className="space-y-2">
            <Typography variant="caption" className="font-medium">
              Apercu (paysage, premiere page)
            </Typography>
            <div
              className="bg-muted relative w-full overflow-hidden rounded-lg border"
              style={{ aspectRatio: '842 / 595' }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Apercu export PDF"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">
                  {isPreviewLoading
                    ? 'Generation de l apercu...'
                    : 'Apercu indisponible'}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="items-center justify-between sm:justify-between">
          <Typography variant="caption">
            Selectionne : {totalSelected}
            {pdfPageCount > 0 ? ` — ${pdfPageCount} page(s) au PDF` : ''}
          </Typography>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              onClick={exportToPdf}
              disabled={isExporting || totalSelected === 0}
            >
              {isExporting ? 'Generation...' : 'Generer le PDF'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
