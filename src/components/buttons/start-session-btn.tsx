'use client';

import { useState, useTransition } from 'react';

import { Button } from '../ui/button';
import { deleteAccount } from '@/lib/actions/auth-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export default function StartSessionBtn({
  isValid,
  handleStartSession,
  isPending,
  hasFreeCredit,
  isMember,
}: {
  isValid: boolean;
  isPending: boolean;
  hasFreeCredit: boolean;
  isMember: boolean;
  handleStartSession: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!isValid || isPending}
          isLoading={isPending}
          className="w-full"
          onClick={() => setIsOpen(true)}
        >
          Start session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5 space-y-5">
          <DialogTitle className="text-lg leading-tight">
            Ready to start your plunge session?
          </DialogTitle>
          <DialogDescription className="text-base leading-tight">
            {isMember
              ? `Once you hit start, the plunge will unlock and your session will begin`
              : `Once you hit start, the plunge will unlock and a credit will be deducted from your account`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 mb-5">
          <Button
            className="sm:w-48"
            onClick={async () => await handleStartSession()}
            disabled={isPending}
            isLoading={isPending}
          >
            Start
          </Button>
          <Button variant={'outline'} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
