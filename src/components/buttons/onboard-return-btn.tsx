'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function OnboardReturnBtn({ className, variant, children }: { className?: string, variant?: any, children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigateToOnboarding = async () => {
    startTransition(async () => {
      router.push(`/`);
    });
  };
  return (
    <Button
      className={cn(className)}
      onClick={async () => await navigateToOnboarding()}
      disabled={isPending}
      isLoading={isPending}
      variant={variant}
    >
      {children}
    </Button>
  );
}
