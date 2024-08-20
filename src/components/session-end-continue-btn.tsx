'use client';

import { useRouter } from 'next/navigation';
import BottomNav from './bottom-nav';
import PenaltyChargeWarning from './penalty-charge-warning';
import { Button } from './ui/button';
import { useTransition } from 'react';

export default function SessionEndContinueBtn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleContinue = async () => {
    startTransition(async () => {
      router.push("/profile");
    });
  };
  return (
    <BottomNav className="gap-2">
      <PenaltyChargeWarning />
      <Button
        disabled={isPending}
        isLoading={isPending}
        onClick={async () => await handleContinue()}
        className='w-full h-16'
      >
        Continue
      </Button>
    </BottomNav>
  );
}
