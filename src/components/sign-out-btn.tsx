'use client';

import { useState, useTransition } from 'react';

import { signOutAction } from '@/actions/actions';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function SignOutBtn() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Log out</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='mb-5'>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          {/* <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription> */}
        </DialogHeader>
        <DialogFooter className='flex flex-col gap-2 mb-5'>
          <Button
            onClick={async () => {
              startTransition(async () => {
                await signOutAction();
              });
            }}
            disabled={isPending}
            isLoading={isPending}
          >
            Log out
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
