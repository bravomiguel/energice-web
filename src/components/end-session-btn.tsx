'use client';

import { useState, useTransition } from 'react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';

const buttonClassNames = 'w-full h-16';

export default function EndSessionBtn({
  isPending,
  handleEndSession,
}: {
  isPending: boolean;
  handleEndSession: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(buttonClassNames)}
          variant="destructive"
          onClick={() => setIsOpen(true)}
          disabled={isPending}
          isLoading={isPending}
        >
          End session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5 space-y-5">
          <DialogTitle className="text-lg leading-tight">
            End session?
          </DialogTitle>
          <DialogDescription className="text-base leading-tight">
            You will have 1 minute to exit and close the plunge
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 mb-5">
          <Button
            variant="destructive"
            className={cn(buttonClassNames)}
            onClick={async () => await handleEndSession()}
            disabled={isPending}
            isLoading={isPending}
          >
            End session
          </Button>
          <Button
            variant="outline"
            className={cn(buttonClassNames)}
            onClick={() => setIsOpen(false)}
          >
            Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
