import { Link } from 'react-router-dom';

export default function CharactersPage() {
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
            <Link className="underline" to={`/characters/${c.id}`}>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
