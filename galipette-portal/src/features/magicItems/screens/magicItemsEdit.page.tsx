/**
 * @fileOverview Edit an existing magic item.
 */
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  updateMagicItemSchema,
  type UpdateMagicItemDto,
} from '@galipette/shared';
import { Button } from '@/common/ui';
import { ErrorBlock } from '@/common/components';
import { PAGES } from '@/app/routes/config/pages';
import {
  useMagicItem,
  useMagicItemMutations,
  useMagicItemTypes,
} from '../hooks';
import {
  MagicItemForm,
  type MagicItemFormSubmitData,
} from '../components';

export default function MagicItemsEditPage() {
  const { magicItemId } = useParams<{ magicItemId: string }>();
  const navigate = useNavigate();
  const id = magicItemId ? parseInt(magicItemId, 10) : NaN;

  const {
    data: item,
    isLoading,
    error,
  } = useMagicItem(Number.isFinite(id) ? id : undefined);

  const {
    data: types,
    isLoading: isLoadingTypes,
    error: typesError,
  } = useMagicItemTypes();

  const { updateMagicItem } = useMagicItemMutations();

  const handleSubmit = async (
    payload: MagicItemFormSubmitData
  ): Promise<void> => {
    if (!item) return;

    const dto: UpdateMagicItemDto = updateMagicItemSchema.parse({
      name: payload.name,
      description: payload.description,
      image: payload.image,
      typeId: payload.typeId,
    });

    try {
      await updateMagicItem.mutateAsync(
        { id: item.id, data: dto },
        {
          onSuccess: updated => {
            const path =
              PAGES.MAGIC_ITEM_DETAILS.build?.({
                magicItemId: updated.id.toString(),
              }) ?? `/magic-items/${updated.id}`;
            navigate(path);
          },
        }
      );
    } catch {
      /* surfaced via ErrorBlock */
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

  if (error || typesError || !item) {
    return (
      <section className="container mx-auto max-w-2xl p-6">
        <ErrorBlock
          message={error?.message ?? typesError?.message ?? 'Objet introuvable'}
          title="Erreur"
        />
        <Link to={PAGES.MAGIC_ITEMS.path} className="mt-4 inline-block">
          <Button type="button" variant="outline">
            Retour
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <Link
          to={
            PAGES.MAGIC_ITEM_DETAILS.build?.({
              magicItemId: item.id.toString(),
            }) ?? `/magic-items/${item.id}`
          }
          className="text-primary mb-2 inline-block text-sm hover:underline"
        >
          Retour au detail
        </Link>
        <h1 className="text-3xl font-bold">Modifier l objet</h1>
        <p className="text-muted-foreground mt-1 text-sm">{item.name}</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <MagicItemForm
          initialData={{
            name: item.name,
            description: item.description,
            image: item.image ?? '',
            typeId: item.type.id.toString(),
          }}
          types={types}
          onSubmit={handleSubmit}
          isLoading={updateMagicItem.isPending || isLoadingTypes}
          error={updateMagicItem.error?.message}
          submitLabel="Enregistrer"
          loadingLabel="Enregistrement..."
        />
      </div>
    </section>
  );
}
