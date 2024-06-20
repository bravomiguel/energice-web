'use client';
import { useRouter } from 'next/navigation';

import BottomNav from './bottom-nav';
import { Button } from './ui/button';
import { useTransition } from 'react';

export default function HealthQuizOutcomeBtn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigateToWaiver = async () => {
    startTransition(async () => {
      router.push('/waiver');
    });
  };
  return (
    <BottomNav className="flex w-full gap-3 justify-center items-center">
      <Button
        className="w-full"
        onClick={async () => await navigateToWaiver()}
        disabled={isPending}
        isLoading={isPending}
      >
        Continue
      </Button>
    </BottomNav>
  );
}
