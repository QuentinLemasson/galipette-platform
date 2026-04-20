import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Typography } from '@/common/components';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/common/ui';
import { TagBadge } from './components/TagBadge';
import { DAMAGE_TYPE_BY_SLUG } from './data/damage-types';
import {
  downloadAfflictionsLandscapePdf,
  getAfflictionsPdfPreviewSrcDoc,
  parseDamageDescription,
  type DescriptionSegment,
} from './utils/afflictions-pdf.util';

type Affliction = {
  id: number;
  name: string;
  slug: string;
  effectDescription: string;
  healingDescription: string;
  tags: string[];
  icon: string;
  image: string;
};

const AFFLICTIONS: Affliction[] = [
  {
    id: 1,
    name: 'Saignement',
    slug: 'saignement',
    effectDescription:
      'Le personnage subit damage:tranchant:X a chaque tour tant que la plaie est ouverte.',
    healingDescription: 'Un bandage ou un soin direct arrete le saignement.',
    tags: ['physique', 'continu', 'damage:tranchant'],
    icon: 'droplets',
    image: '/mock/afflictions/saignement.png',
  },
  {
    id: 2,
    name: 'Fatigue',
    slug: 'fatigue',
    effectDescription: 'Les actions coutent plus d effort et les jets sont penalises.',
    healingDescription: 'Repos complet ou effet de recuperation.',
    tags: ['etat', 'endurance'],
    icon: 'bed',
    image: '/mock/afflictions/fatigue.png',
  },
  {
    id: 3,
    name: 'Nausee',
    slug: 'nausee',
    effectDescription: 'Le personnage est incommode et peut perdre son action.',
    healingDescription: 'Attendre que l effet passe ou utiliser un antidote.',
    tags: ['physique', 'toxine'],
    icon: 'pill',
    image: '/mock/afflictions/nausee.png',
  },
  {
    id: 4,
    name: 'Peur',
    slug: 'peur',
    effectDescription: 'Difficulte a approcher la source de la terreur.',
    healingDescription: 'Soutien moral ou dissipation de la menace.',
    tags: ['mental', 'controle'],
    icon: 'triangle-alert',
    image: '/mock/afflictions/peur.png',
  },
  {
    id: 5,
    name: 'Secoue',
    slug: 'secoue',
    effectDescription: 'Perte de concentration apres un choc violent.',
    healingDescription: 'Quelques instants de recuperation suffisent.',
    tags: ['physique', 'temporaire', 'damage:interne'],
    icon: 'zap',
    image: '/mock/afflictions/secoue.png',
  },
  {
    id: 6,
    name: 'Enflamme',
    slug: 'enflamme',
    effectDescription:
      'Le personnage subit damage:feu:2 tant que les flammes ne sont pas eteintes.',
    healingDescription: 'Eteindre les flammes avec eau, sable ou magie.',
    tags: ['continu', 'damage:feu'],
    icon: 'flame',
    image: '/mock/afflictions/enflamme.png',
  },
];

const MAX_EXPORT_TOTAL = 10;

const renderDamageDescription = (
  description: string
): ReactNode[] => {
  return parseDamageDescription(description, DAMAGE_TYPE_BY_SLUG).map(
    (segment: DescriptionSegment, index: number) =>
      segment.color ? (
        <span key={`${segment.text}-${index}`} style={{ color: segment.color }}>
          {segment.text}
        </span>
      ) : (
        <span key={`${segment.text}-${index}`}>{segment.text}</span>
      )
  );
};

export default function AfflictionsPage() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<number, number>>({});
  const [previewSrcDoc, setPreviewSrcDoc] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const totalSelected = useMemo(
    () => Object.values(selectedQuantities).reduce((sum, quantity) => sum + quantity, 0),
    [selectedQuantities]
  );

  const selectedAfflictionsForExport = useMemo(
    () =>
      AFFLICTIONS.flatMap(affliction => {
        const quantity = selectedQuantities[affliction.id] ?? 0;
        return Array.from({ length: quantity }, () => affliction);
      }),
    [selectedQuantities]
  );

  useEffect(() => {
    if (!isExportOpen) {
      setPreviewSrcDoc(null);
      setPreviewLoading(false);
      return;
    }

    if (selectedAfflictionsForExport.length === 0) {
      setPreviewSrcDoc(null);
      setPreviewLoading(false);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);
    setPreviewSrcDoc(null);

    void getAfflictionsPdfPreviewSrcDoc({
      afflictions: selectedAfflictionsForExport,
      damageTypeBySlug: DAMAGE_TYPE_BY_SLUG,
    })
      .then(srcDoc => {
        if (!cancelled) {
          setPreviewSrcDoc(srcDoc);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPreviewLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isExportOpen, selectedAfflictionsForExport]);

  const toggleAfflictionSelection = (afflictionId: number, checked: boolean): void => {
    setSelectedQuantities(currentQuantities => {
      if (!checked) {
        const { [afflictionId]: _, ...remaining } = currentQuantities;
        return remaining;
      }

      if (currentQuantities[afflictionId]) {
        return currentQuantities;
      }

      if (totalSelected >= MAX_EXPORT_TOTAL) {
        return currentQuantities;
      }

      return { ...currentQuantities, [afflictionId]: 1 };
    });
  };

  const updateAfflictionQuantity = (afflictionId: number, nextQuantity: number): void => {
    setSelectedQuantities(currentQuantities => {
      const clampedQuantity = Math.max(1, nextQuantity);
      const othersTotal = Object.entries(currentQuantities).reduce(
        (sum, [id, quantity]) => (Number(id) === afflictionId ? sum : sum + quantity),
        0
      );
      const allowedQuantity = Math.min(clampedQuantity, MAX_EXPORT_TOTAL - othersTotal);

      return {
        ...currentQuantities,
        [afflictionId]: Math.max(1, allowedQuantity),
      };
    });
  };

  const exportToPdf = async (): Promise<void> => {
    if (selectedAfflictionsForExport.length === 0) {
      return;
    }

    setIsExporting(true);

    try {
      await downloadAfflictionsLandscapePdf({
        afflictions: selectedAfflictionsForExport,
        damageTypeBySlug: DAMAGE_TYPE_BY_SLUG,
        fileName: `afflictions-export-${new Date().toISOString().slice(0, 10)}.pdf`,
      });
      setIsExportOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="container mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Typography variant="h1" className="text-2xl font-bold">
            Afflictions
          </Typography>
          <Typography variant="muted" className="mt-1">
            Restitution des afflictions actuellement enregistrees.
          </Typography>
        </div>

        <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
          <Button onClick={() => setIsExportOpen(true)}>Exporter en PDF</Button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Exporter des afflictions</DialogTitle>
              <DialogDescription>
                Choisissez plusieurs afflictions et leur quantite. Le total ne peut pas depasser{' '}
                {MAX_EXPORT_TOTAL}. PDF paysage, une page : grille 5 x 2 (chaque carte ~ 1/5 de la
                largeur et 1/2 de la hauteur de la page).
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[280px] overflow-auto space-y-3 pr-1">
              {AFFLICTIONS.map(affliction => {
                const isSelected = selectedQuantities[affliction.id] !== undefined;
                const quantity = selectedQuantities[affliction.id] ?? 1;
                const canSelectMore = totalSelected < MAX_EXPORT_TOTAL;

                return (
                  <div
                    key={affliction.id}
                    className="flex items-center justify-between gap-4 rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`affliction-export-${affliction.id}`}
                        checked={isSelected}
                        disabled={!isSelected && !canSelectMore}
                        onCheckedChange={checked =>
                          toggleAfflictionSelection(affliction.id, checked === true)
                        }
                      />
                      <Label
                        htmlFor={`affliction-export-${affliction.id}`}
                        className="cursor-pointer"
                      >
                        {affliction.name}
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`affliction-quantity-${affliction.id}`}
                        className="text-muted-foreground text-xs"
                      >
                        Nombre
                      </Label>
                      <Input
                        id={`affliction-quantity-${affliction.id}`}
                        type="number"
                        min={1}
                        max={MAX_EXPORT_TOTAL}
                        value={quantity}
                        disabled={!isSelected}
                        onChange={event =>
                          updateAfflictionQuantity(
                            affliction.id,
                            Number.parseInt(event.target.value || '1', 10)
                          )
                        }
                        className="w-20"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {totalSelected > 0 && (
              <div className="mt-4 space-y-2">
                <Typography variant="caption" className="font-medium">
                  Apercu (paysage, cartes uniquement)
                </Typography>
                <div
                  className="relative w-full overflow-hidden rounded-lg border bg-muted"
                  style={{ aspectRatio: '842 / 595' }}
                >
                  {previewLoading ? (
                    <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
                      Chargement de l&apos;apercu...
                    </div>
                  ) : previewSrcDoc ? (
                    <iframe
                      key={previewSrcDoc.length}
                      title="Apercu export PDF"
                      className="absolute inset-0 h-full w-full border-0"
                      srcDoc={previewSrcDoc}
                    />
                  ) : (
                    <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
                      Apercu indisponible
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="items-center justify-between sm:justify-between">
              <Typography variant="caption">
                Total selectionne: {totalSelected}/{MAX_EXPORT_TOTAL}
              </Typography>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsExportOpen(false)}>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AFFLICTIONS.map(affliction => (
          <Card key={affliction.id}>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{affliction.name}</CardTitle>
                <Typography variant="caption">Slug: {affliction.slug}</Typography>
              </div>
              <div className="flex flex-wrap gap-2">
                {affliction.tags.map(tag => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    damageTypeBySlug={DAMAGE_TYPE_BY_SLUG}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Typography variant="body-sm">ID: {affliction.id}</Typography>
              <Typography variant="body-sm">
                Effet: {renderDamageDescription(affliction.effectDescription)}
              </Typography>
              <Typography variant="body-sm">
                Soin: {renderDamageDescription(affliction.healingDescription)}
              </Typography>
              <Typography variant="caption">Icone: {affliction.icon}</Typography>
              <Typography variant="caption">Image: {affliction.image}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
