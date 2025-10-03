import { useParams } from 'react-router-dom';

export default function CharacterDetailsPage() {
  const { characterId } = useParams();

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Character Details</h1>
      <p className="text-sm mt-2">Placeholder for character: {characterId}</p>
    </section>
  );
}
