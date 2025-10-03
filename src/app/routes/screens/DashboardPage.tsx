import { useNavigation } from '@/common/hooks/useNavigation';
import { PAGES } from '@/app/routes/config/pages';

/**
 * Placeholder dashboard screen.
 */
export default function DashboardPage() {
  const navigation = useNavigation();
  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm mt-2">
        This is a placeholder for the Dashboard page.
      </p>
      <button
        className="underline"
        onClick={() => navigation.go(PAGES.CHARACTERS)}
      >
        Go to Characters
      </button>
    </section>
  );
}
