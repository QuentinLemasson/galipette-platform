/**
 * @fileOverview Detail view for a single magic item.
 */
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/ui';
import { ErrorBlock, Typography } from '@/common/components';
import { PAGES } from '@/app/routes/config/pages';
import { useMagicItem, useMagicItemMutations } from '../hooks';
import { MagicItemCardPreview } from '../components';

export default function MagicItemsDetailsPage() {
  const { magicItemId } = useParams<{ magicItemId: string }>();
  const navigate = useNavigate();
  const id = magicItemId ? parseInt(magicItemId, 10) : NaN;

  const {
    data: item,
    isLoading,
    error,
  } = useMagicItem(Number.isFinite(id) ? id : undefined);

  const { deleteMagicItem } = useMagicItemMutations();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async (): Promise<void> => {
    if (!item) return;
    try {
      await deleteMagicItem.mutateAsync(item.id, {
        onSuccess: () => {
          navigate(PAGES.MAGIC_ITEMS.path);
        },
      });
    } catch {
      /* handled by ErrorBlock */
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <ErrorBlock
          message={error?.message ?? 'Objet introuvable'}
          title="Erreur"
        />
        <Link to={PAGES.MAGIC_ITEMS.path} className="mt-4 inline-block">
          <Button type="button" variant="outline">
            Retour a la liste
          </Button>
        </Link>
      </div>
    );
  }

  const cardSource = {
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image,
    type: { name: item.type.name },
  };

  const editPath =
    PAGES.MAGIC_ITEM_EDIT.build?.({
      magicItemId: item.id.toString(),
    }) ?? `/magic-items/${item.id}/edit`;

  return (
    <section className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to={PAGES.MAGIC_ITEMS.path}
            className="text-primary mb-2 inline-block text-sm hover:underline"
          >
            Retour a la liste
          </Link>
          <Typography variant="h1" className="text-3xl font-bold">
            {item.name}
          </Typography>
          <Typography variant="muted" className="mt-1">
            Type : {item.type.name}
          </Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={editPath}>
            <Button type="button" variant="outline">
              Editer
            </Button>
          </Link>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-6">
          <Typography variant="h3" className="font-semibold">
            Description
          </Typography>
          <Typography variant="body-sm" className="whitespace-pre-wrap">
            {item.description}
          </Typography>
          {item.image && (
            <Typography variant="caption" className="text-muted-foreground block">
              Image :{' '}
              <a href={item.image} className="text-primary underline">
                {item.image}
              </a>
            </Typography>
          )}
        </div>

        <div className="space-y-2">
          <Typography variant="h3" className="font-semibold">
            Apercu carte
          </Typography>
          <MagicItemCardPreview item={cardSource} />
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cet objet ?</DialogTitle>
          </DialogHeader>
          <Typography variant="body-sm">
            Cette action est irreversible.
          </Typography>
          {deleteMagicItem.error && (
            <ErrorBlock message={deleteMagicItem.error.message} />
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMagicItem.isPending}
              onClick={handleDelete}
            >
              {deleteMagicItem.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
