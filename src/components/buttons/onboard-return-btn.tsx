'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function OnboardReturnBtn({
  className,
  variant,
  children,
  isNameSaved,
  isWaiverSigned,
}: {
  className?: string;
  variant?: any;
  children: React.ReactNode;
  isNameSaved: boolean;
  isWaiverSigned: boolean;
}) {
  // onboarded check
  // if (!profile?.name) redirect('/member-details');
  // if (!profile.isWaiverSigned) redirect('/waiver');

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigateToOnboarding = async () => {
    startTransition(async () => {
      if (!isNameSaved) router.push(`/member-details`);
      if (!isWaiverSigned) router.push(`/waiver`);
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
