import H1 from '@/components/h1';
import HealthQuiz from '@/components/health-quiz';
import Subtitle from '@/components/subtitle';

export default function Page() {
  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Health Quiz</H1>
        <Subtitle>
          1-min quiz to check if cold plunging suits your health needs.
        </Subtitle>
      </div>
      <HealthQuiz />
    </main>
  );
}
