'use client';

import { useRouter } from 'next/navigation';

import { Button } from './ui/button';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function StartPlungeBtn({ className, variant, children }: { className?: string, variant?: any, children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigateToUnit = async () => {
    startTransition(async () => {
      router.push(`/unit/${process.env.NEXT_PUBLIC_TEXAS_IRON_GYM_ID}`);
    });
  };
  return (
    <Button
      className={cn(className)}
      onClick={async () => await navigateToUnit()}
      disabled={isPending}
      isLoading={isPending}
      variant={variant}
    >
      {children}
    </Button>
  );
}
