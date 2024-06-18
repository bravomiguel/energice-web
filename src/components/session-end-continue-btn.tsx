'use client';

import { useRouter } from 'next/navigation';
import BottomNav from './bottom-nav';
import PenaltyChargeWarning from './penalty-charge-warning';
import { Button } from './ui/button';

export default function SessionEndContinueBtn() {
  const router = useRouter();
  return (
    <BottomNav className="space-y-3">
      <Button className="w-full" onClick={() => router.push('/')}>
        Continue
      </Button>
      <PenaltyChargeWarning />
    </BottomNav>
  );
}
