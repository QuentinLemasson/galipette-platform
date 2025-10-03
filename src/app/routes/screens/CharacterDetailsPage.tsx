import { useParams } from 'react-router-dom';
import { useNavigation } from '@/common/hooks/useNavigation';
import { PAGES } from '@/app/routes/config/pages';

/**
 * Placeholder dynamic screen showing a character by id.
 */
export default function CharacterDetailsPage() {
  const { characterId } = useParams();
  const navigation = useNavigation();

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Character Details</h1>
      <p className="text-sm mt-2">Placeholder for character: {characterId}</p>
      <button
        className="underline"
        onClick={() => navigation.go(PAGES.CHARACTERS)}
      >
        Back to list
      </button>
    </section>
  );
}
