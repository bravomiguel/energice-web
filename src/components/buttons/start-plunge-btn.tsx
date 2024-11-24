'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

const unitId = process.env.NEXT_PUBLIC_SWEAT440_HIGHLAND_ID;

export default function StartPlungeBtn({
  className,
  variant,
  children,
  isSweat440Member,
  sweat440MemberOption,
}: {
  className?: string;
  variant?: any;
  children: React.ReactNode;
  isSweat440Member?: boolean;
  sweat440MemberOption?: boolean;
}) {
  // console.log({ isSweat440Member, sweat440MemberOption });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateToUnit = async () => {
    startTransition(async () => {
      if (isSweat440Member === false && sweat440MemberOption === true) {
        router.push(`/partner-membership/${unitId}?singlePlunge=true`);
        return;
      }
      router.push(`/unit/${unitId}`);
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
