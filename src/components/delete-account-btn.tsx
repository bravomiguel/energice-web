'use client';

import { useState, useTransition } from 'react';

import { Button } from './ui/button';
import { deleteAccount } from '@/actions/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

// export default function DeleteAccountBtn() {
//   const [isPending, startTransition] = useTransition();

//   const handleDeleteAccount = async () => {
//     startTransition(async () => {
//       const response = await deleteAccount();
//       if (response?.error) {
//         console.error({ error: response.error });
//       }
//     });
//   };
//   return (
//     <Button
//       onClick={async () => await handleDeleteAccount()}
//       disabled={isPending}
//       isLoading={isPending}
//       variant="outline"
//     >
//       Delete Account
//     </Button>
//   );
// }

export default function DeleteAccountBtn() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-5 space-y-5">
          <DialogTitle className='text-lg leading-tight'>Are you sure you want to delete your account?</DialogTitle>
          <DialogDescription className='text-base leading-tight'>
            This action cannot be undone. Your account would be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 mb-5">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            variant="outline"
            onClick={async () => {
              startTransition(async () => {
                await deleteAccount();
              });
            }}
            disabled={isPending}
            isLoading={isPending}
          >
            Delete account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
