'use client';

import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function UnlockPlungeBtn({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  return (
    <Button
      disabled={disabled}
      className="flex-1"
      onClick={() => router.push('/session')}
    >
      Unlock Plunge
    </Button>
  );
}
