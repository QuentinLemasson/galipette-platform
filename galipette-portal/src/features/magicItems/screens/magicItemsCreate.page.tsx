/**
 * @fileOverview Create a new magic item.
 */
import { Link, useNavigate } from 'react-router-dom';
import {
  createMagicItemSchema,
  type CreateMagicItemDto,
} from '@galipette/shared';
import { Button } from '@/common/ui';
import { ErrorBlock } from '@/common/components';
import { PAGES } from '@/app/routes/config/pages';
import { useMagicItemMutations, useMagicItemTypes } from '../hooks';
import {
  MagicItemForm,
  type MagicItemFormSubmitData,
} from '../components';

export default function MagicItemsCreatePage() {
  const navigate = useNavigate();
  const {
    data: types,
    isLoading: isLoadingTypes,
    error: typesError,
  } = useMagicItemTypes();
  const { createMagicItem } = useMagicItemMutations();

  const handleSubmit = async (
    payload: MagicItemFormSubmitData
  ): Promise<void> => {
    const dto: CreateMagicItemDto = createMagicItemSchema.parse({
      name: payload.name,
      description: payload.description,
      image: payload.image,
      typeId: payload.typeId,
    });

    try {
      await createMagicItem.mutateAsync(dto, {
        onSuccess: created => {
          const path =
            PAGES.MAGIC_ITEM_DETAILS.build?.({
              magicItemId: created.id.toString(),
            }) ?? `/magic-items/${created.id}`;
          navigate(path);
        },
      });
    } catch {
      /* surfaced via ErrorBlock */
    }
  };

  if (typesError) {
    return (
      <section className="container mx-auto max-w-2xl p-6">
        <ErrorBlock message={typesError.message} title="Erreur" />
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
          to={PAGES.MAGIC_ITEMS.path}
          className="text-primary mb-2 inline-block text-sm hover:underline"
        >
          Retour a la liste
        </Link>
        <h1 className="text-3xl font-bold">Creer un objet magique</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Renseignez les informations de l objet.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <MagicItemForm
          types={types}
          onSubmit={handleSubmit}
          isLoading={createMagicItem.isPending || isLoadingTypes}
          error={createMagicItem.error?.message}
          submitLabel="Creer"
          loadingLabel="Creation..."
        />
      </div>
    </section>
  );
}
