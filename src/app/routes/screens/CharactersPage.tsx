import { Link } from 'react-router-dom';
import { useNavigation } from '@/common/hooks/useNavigation';
import { PAGES } from '@/app/routes/config/pages';

/**
 * Placeholder characters list screen.
 * Demonstrates declarative navigation to a dynamic route.
 */
export default function CharactersPage() {
  const navigation = useNavigation();
  const demoCharacters = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Characters</h1>
      <p className="text-sm mt-2">
        This is a placeholder for the Characters list.
      </p>

      <ul className="mt-4 list-disc list-inside">
        {demoCharacters.map(c => (
          <li key={c.id}>
            <Link
              className="underline"
              to={PAGES.CHARACTERS.path}
              onClick={e => {
                e.preventDefault();
                navigation.go(PAGES.CHARACTER_DETAILS, { characterId: c.id });
              }}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
