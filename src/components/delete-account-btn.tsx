'use client';

import { TSignupForm } from '@/lib/types';
import { Button } from './ui/button';
import { deleteAccount } from '@/actions/actions';

export default function DeleteAccountBtn() {
  return (
    <Button
      onClick={async () => {
        const response = await deleteAccount();
        if (response?.error) {
          console.error({ error: response.error });
        }
      }}
    >
      Delete Account
    </Button>
  );
}
