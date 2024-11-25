'use client';

import { toast } from 'sonner';

import { Button } from '../ui/button';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const unitId = process.env.NEXT_PUBLIC_SWEAT440_HIGHLAND_ID;

export default function CheckoutBtn({
  checkoutAction,
  className,
  variant,
  children,
  isSweat440Member,
  sweat440MemberOption,
}: {
  checkoutAction: () => Promise<{ error: string }>;
  className?: string;
  variant?: any;
  children: React.ReactNode;
  isSweat440Member?: boolean;
  sweat440MemberOption?: boolean;
}) {
  // console.log({ isSweat440Member, sweat440MemberOption });
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const createSubscriptionCheckout = async () => {
    startTransition(async () => {
      if (isSweat440Member === false && sweat440MemberOption === true) {
        router.push(`/partner-membership/${unitId}?unlimitedMembership=true`);
        return;
      }
      const respCheckout = await checkoutAction();
      if (respCheckout?.error) {
        console.error({ error: respCheckout.error });
        toast.error(respCheckout.error);
      }
    });
  };
  return (
    <Button
      className={cn(className)}
      onClick={createSubscriptionCheckout}
      disabled={isPending}
      isLoading={isPending}
      variant={variant}
    >
      {children}
    </Button>
  );
}
