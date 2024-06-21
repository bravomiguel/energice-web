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
      router.push(`/unit/${process.env.NEXT_PUBLIC_TEXAS_IRON_GYM_ID}`);
    });
  };
  return (
    <BottomNav className="gap-1">
      <Button
        disabled={isPending}
        isLoading={isPending}
        onClick={async () => await handleContinue()}
      >
        Continue
      </Button>
      <PenaltyChargeWarning />
    </BottomNav>
  );
}
