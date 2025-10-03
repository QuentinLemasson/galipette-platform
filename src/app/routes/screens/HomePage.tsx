import { WelcomeMessage } from '@/features/welcome';

export default function HomePage() {
  return (
    <section className="container mx-auto p-6">
      <WelcomeMessage />
    </section>
  );
}
