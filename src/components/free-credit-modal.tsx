'use client';

import { useState } from 'react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';

export default function FreeCreditModal({
  freeCredits,
}: {
  freeCredits: number;
}) {
  const [isOpen, setIsOpen] = useState(freeCredits > 0);
  const { numberOfSessions } = usePlungeSessions();
  const dialogDescription =
    numberOfSessions === 0
      ? `Enjoy your first plunge on us! 💙`
      : `Enjoy a free plunge on us! 💙`;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className="mb-3">
          <DialogTitle className="text-xl">Free plunge credit</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-xl text-zinc-800 text-center mb-5">
          {dialogDescription}
        </DialogDescription>
        <DialogFooter className="flex flex-col gap-2 mb-3">
          <Button onClick={() => setIsOpen(false)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
