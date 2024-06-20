'use client';

import { useRouter } from 'next/navigation';

import { Button } from './ui/button';
import { useTransition } from 'react';

export default function StartPlungeBtn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigateToUnit = async () => {
    startTransition(async () => {
      router.push(`/unit/${process.env.NEXT_PUBLIC_TEXAS_IRON_GYM_ID}`)
    })
  }
  return (
    <Button
      onClick={async () => await navigateToUnit()}
      disabled={isPending}
      isLoading={isPending}
    >
      Start Plunge
    </Button>
  );
}
