import H1 from '@/components/h1';
import { Session } from '@prisma/client';

export default function Page({ params }: { params: { sessionId: Session['id'] } }) {
  return (
    <main className='flex-1 flex flex-col gap-10"'>
      <H1>Session</H1>
    </main>
  );
}
