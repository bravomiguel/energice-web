'use client';

import { toast } from 'sonner';

import { Button } from '../ui/button';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function CheckoutBtn({
  checkoutAction,
  className,
  variant,
  children,
}: {
  checkoutAction: () => Promise<{ error: string }>;
  className?: string;
  variant?: any;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const createSubscriptionCheckout = async () => {
    startTransition(async () => {
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
      onClick={async () => await createSubscriptionCheckout()}
      disabled={isPending}
      isLoading={isPending}
      variant={variant}
    >
      {children}
    </Button>
  );
}
