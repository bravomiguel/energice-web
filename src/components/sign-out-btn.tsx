'use client';

import { signOutAction } from '@/actions/actions';
import { Button } from './ui/button';
import { useTransition } from 'react';

export default function SignOutBtn() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      onClick={async () => {
        startTransition(async () => {
          await signOutAction();
        });
      }}
      disabled={isPending}
      isLoading={isPending}
    >
      Sign out
    </Button>
  );
}
