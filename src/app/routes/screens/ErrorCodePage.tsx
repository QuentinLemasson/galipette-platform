import { useParams } from 'react-router-dom';
import { useNavigation } from '@/common/hooks/useNavigation';
import { PAGES } from '@/app/routes/config/pages';

/**
 * Placeholder error screen showing an error code from the URL.
 */
export default function ErrorCodePage() {
  const { errorCode } = useParams();
  const navigation = useNavigation();

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Error {errorCode}</h1>
      <p className="text-sm mt-2">This is a placeholder error page.</p>
      <button className="underline" onClick={() => navigation.go(PAGES.HOME)}>
        Go Home
      </button>
    </section>
  );
}
