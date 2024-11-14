'use client';

import { toast } from 'sonner';

import { Button } from '../ui/button';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { packCheckoutSession } from '@/actions/actions';

export default function BuySessionBtn({
  className,
  variant,
  children,
}: {
  className?: string;
  variant?: any;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const createPackCheckout = async () => {
    startTransition(async () => {
      const respCheckout = await packCheckoutSession();
      if (respCheckout?.error) {
        console.error({ error: respCheckout.error });
        toast.error(respCheckout.error);
      }
    });
  };
  return (
    <Button
      className={cn(className)}
      onClick={async () => await createPackCheckout()}
      disabled={isPending}
      isLoading={isPending}
      variant={variant}
    >
      {children}
    </Button>
  );
}
