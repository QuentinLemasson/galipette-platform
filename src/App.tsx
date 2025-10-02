import { Button } from '@/components/ui/button';
import { getAppVersion, getContributors } from '@/common/utils/package.util';
import { getAppDisplayName } from '@/common/utils/package.util';

export default function App() {
  const appName = getAppDisplayName();
  const version = getAppVersion();
  const contributors = getContributors();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{appName}</h1>
        <p className="text-sm text-muted-foreground">v{version}</p>
        {contributors.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Contributors: {contributors.join(', ')}
          </p>
        )}
        <div className="pt-2">
          <Button>Test Button</Button>
        </div>
      </div>
    </main>
  );
}
