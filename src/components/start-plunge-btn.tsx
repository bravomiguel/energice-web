'use client';

import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function StartPlungeBtn({ disabled, unitId }: { disabled: boolean, unitId: string }) {
  const router = useRouter();
  return (
    <Button
      disabled={disabled}
      className="flex-1"
      onClick={() => router.push(`/plunge/${unitId}/unlock`)}
    >
      Unlock Plunge
    </Button>
  );
}
