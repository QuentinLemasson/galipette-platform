import { useParams } from 'react-router-dom';

export default function ErrorCodePage() {
  const { errorCode } = useParams();

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Error {errorCode}</h1>
      <p className="text-sm mt-2">This is a placeholder error page.</p>
    </section>
  );
}
