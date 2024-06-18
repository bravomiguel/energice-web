'use client';

import { useRouter } from 'next/navigation';

import { Button } from './ui/button';

export default function StartPlungeBtn() {
  const router = useRouter();
  return (
    <Button
      onClick={() =>
        router.push(`/unit/${process.env.NEXT_PUBLIC_TEXAS_IRON_GYM_ID}`)
      }
    >
      Start Plunge
    </Button>
  );
}
