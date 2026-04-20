export type DamageType = {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
};

export const DAMAGE_TYPES: DamageType[] = [
  {
    id: 1,
    name: 'Tranchant',
    slug: 'tranchant',
    description: 'Degats causes par des lames ou des objets coupants.',
    color: '#ef4444',
  },
  {
    id: 2,
    name: 'Feu',
    slug: 'feu',
    description: 'Degats thermiques provoques par les flammes ou la chaleur.',
    color: '#f97316',
  },
  {
    id: 3,
    name: 'Electrique',
    slug: 'electrique',
    description: 'Degats d origine electrique ou d arcs de courant.',
    color: '#facc15',
  },
  {
    id: 4,
    name: 'Gel',
    slug: 'gel',
    description: 'Degats de froid intense pouvant ralentir les mouvements.',
    color: '#38bdf8',
  },
  {
    id: 5,
    name: 'Arcane',
    slug: 'arcane',
    description: 'Degats issus de forces mystiques ou de rituels magiques.',
    color: '#a855f7',
  },
  {
    id: 6,
    name: 'Interne',
    slug: 'interne',
    description: 'Degats qui affectent directement les organes ou l energie vitale.',
    color: '#6b7280',
  },
];

export const DAMAGE_TYPE_BY_SLUG: Record<string, Pick<DamageType, 'name' | 'color'>> =
  Object.fromEntries(
    DAMAGE_TYPES.map(damageType => [
      damageType.slug,
      { name: damageType.name, color: damageType.color },
    ])
  );

export type DamageTypeBySlug = typeof DAMAGE_TYPE_BY_SLUG;
