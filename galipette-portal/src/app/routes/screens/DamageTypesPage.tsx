import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/common/ui';
import { Typography } from '@/common/components';
import { DAMAGE_TYPES } from './data/damage-types';

export default function DamageTypesPage() {
  return (
    <section className="container mx-auto p-6 space-y-6">
      <div>
        <Typography variant="h1" className="text-2xl font-bold">
          Types de degats
        </Typography>
        <Typography variant="muted" className="mt-1">
          Restitution des types de degats actuellement enregistres.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAMAGE_TYPES.map(damageType => (
          <Card key={damageType.id}>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{damageType.name}</CardTitle>
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: damageType.color, color: '#111827' }}
                >
                  {damageType.color}
                </Badge>
              </div>
              <Typography variant="caption">Slug: {damageType.slug}</Typography>
            </CardHeader>
            <CardContent className="space-y-2">
              <Typography variant="body-sm">ID: {damageType.id}</Typography>
              <Typography variant="body-sm">
                {damageType.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
