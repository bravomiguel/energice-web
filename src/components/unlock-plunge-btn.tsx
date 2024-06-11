'use client';

import { Unit } from '@prisma/client';

import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';
import { unlockAction } from '@/actions/actions';
import { useTransition } from 'react';

export default function UnlockPlungeBtn({
  unitId,
  lockDeviceId,
  children,
  className,
  variant,
}: {
  unitId: Unit['id'];
  lockDeviceId: Unit['lockDeviceId'];
  children: React.ReactNode;
  className?: string;
  variant?: ButtonProps['variant'];
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant={variant}
      className={cn(className)}
      onClick={async () => {
        startTransition(async () => {
          await unlockAction({ unitId, lockDeviceId });
        });
      }}
      disabled={isPending}
    >
      {children}
    </Button>
  );
}
