import { Badge } from '@/common/ui';
import type { DamageTypeBySlug } from '../data/damage-types';

type TagBadgeProps = {
  tag: string;
  damageTypeBySlug: DamageTypeBySlug;
};

const DAMAGE_TAG_PREFIX = 'damage:';

const isDamageTag = (tag: string): boolean => tag.startsWith(DAMAGE_TAG_PREFIX);

const getDamageSlug = (tag: string): string => tag.slice(DAMAGE_TAG_PREFIX.length);

/**
 * Displays a tag badge and applies damage-type color when tag domain is "damage".
 */
export function TagBadge({ tag, damageTypeBySlug }: TagBadgeProps) {
  if (!isDamageTag(tag)) {
    return <Badge variant="secondary">{tag}</Badge>;
  }

  const damageSlug = getDamageSlug(tag);
  const damageType = damageTypeBySlug[damageSlug];

  if (!damageType) {
    return <Badge variant="outline">{tag}</Badge>;
  }

  return (
    <Badge
      variant="outline"
      className="font-medium"
      style={{ borderColor: damageType.color, color: damageType.color }}
    >
      {`degats:${damageType.name.toLowerCase()}`}
    </Badge>
  );
}
