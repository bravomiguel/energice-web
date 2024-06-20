'use client';

import { Button } from './ui/button';
import { deleteAccount } from '@/actions/actions';
import { useTransition } from 'react';

export default function DeleteAccountBtn() {
  const [isPending, startTransition] = useTransition();

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      const response = await deleteAccount();
      if (response?.error) {
        console.error({ error: response.error });
      }
    });
  };
  return (
    <Button
      onClick={async () => await handleDeleteAccount()}
      disabled={isPending}
      isLoading={isPending}
    >
      Delete Account
    </Button>
  );
}
