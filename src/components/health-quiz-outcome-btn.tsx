'use client';
import { useRouter } from 'next/navigation';

import BottomNav from './bottom-nav';
import { Button } from './ui/button';

export default function HealthQuizOutcomeBtn() {
  const router = useRouter();
  return (
    <BottomNav className="flex w-full gap-3 justify-center items-center">
      <Button className="w-full" onClick={() => router.push('/waiver')}>
        Continue
      </Button>
    </BottomNav>
  );
}