import { Card, CardContent, CardHeader, CardTitle } from '@/common/ui';
import { Typography } from '@/common/components';
import type { ReactNode } from 'react';
import { TagBadge } from './components/TagBadge';
import type { DamageTypeBySlug } from './data/damage-types';
import { DAMAGE_TYPE_BY_SLUG } from './data/damage-types';

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

const DAMAGE_VALUE_TOKEN_REGEX = /damage:([a-z0-9-]+):(X|\d+)/gi;

const renderDamageDescription = (
  description: string,
  damageTypeBySlug: DamageTypeBySlug
): ReactNode[] => {
  const regex = new RegExp(DAMAGE_VALUE_TOKEN_REGEX);
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null = regex.exec(description);

  while (match) {
    const [fullMatch, damageSlug, value] = match;
    const matchStart = match.index;

    if (matchStart > cursor) {
      nodes.push(description.slice(cursor, matchStart));
    }

    const damageType = damageTypeBySlug[damageSlug];

    if (!damageType) {
      nodes.push(fullMatch);
    } else {
      nodes.push(
        <span
          key={`${damageSlug}-${value}-${matchStart}`}
          className="font-medium"
          style={{ color: damageType.color }}
        >
          {`${value} degats de ${damageType.name.toLowerCase()}`}
        </span>
      );
    }

    cursor = matchStart + fullMatch.length;
    match = regex.exec(description);
  }

  if (cursor < description.length) {
    nodes.push(description.slice(cursor));
  }

  return nodes.length > 0 ? nodes : [description];
};

export default function AfflictionsPage() {
  return (
    <section className="container mx-auto p-6 space-y-6">
      <div>
        <Typography variant="h1" className="text-2xl font-bold">
          Afflictions
        </Typography>
        <Typography variant="muted" className="mt-1">
          Restitution des afflictions actuellement enregistrees.
        </Typography>
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
                Effet:{' '}
                {renderDamageDescription(
                  affliction.effectDescription,
                  DAMAGE_TYPE_BY_SLUG
                )}
              </Typography>
              <Typography variant="body-sm">
                Soin: {affliction.healingDescription}
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
