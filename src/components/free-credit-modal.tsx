'use client';

import { useState, useTransition } from 'react';

import { signOutAction } from '@/actions/actions';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export default function FreeCreditModal({
  hasFreeCredit,
}: {
  hasFreeCredit: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(hasFreeCredit);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Log out</Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>Free plunge credit</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-xl text-zinc-800 text-center mb-5">
          Enjoy your first plunge on us! 💙
        </DialogDescription>
        <DialogFooter className="flex flex-col gap-2 mb-5">
          <Button onClick={() => setIsOpen(false)}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
