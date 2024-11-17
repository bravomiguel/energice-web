'use client';

import { Session, Unit } from '@prisma/client';

import { Button, ButtonProps } from '../ui/button';
import { cn } from '@/lib/utils';
import { startSession, unlockAction } from '@/lib/actions';
import { TransitionStartFunction } from 'react';
import { toast } from 'sonner';

export default function UnlockPlungeBtn({
  unitId,
  sessionId,
  isPending,
  startTransition,
  children,
  className,
  variant,
}: {
  unitId: Unit['id'];
  sessionId: Session['id'];
  isPending: boolean;
  startTransition: TransitionStartFunction;
  children: React.ReactNode;
  className?: string;
  variant?: ButtonProps['variant'];
}) {
  return (
    <Button
      variant={variant}
      className={cn(className)}
      onClick={async () => {
        startTransition(async () => {
          const unlockResponse = await unlockAction({ unitId });
          if (unlockResponse?.error) {
            console.error({ error: unlockResponse.error });
            toast.error(unlockResponse.error);
          }
          const startSessionResp = await startSession({ sessionId });
          if (startSessionResp.error) {
            console.error({ error: startSessionResp.error });
            toast.error(startSessionResp.error);
          }
        });
      }}
      disabled={isPending}
    >
      {children}
    </Button>
  );
}
