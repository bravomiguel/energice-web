'use client';

import { TAuthForm } from '@/lib/types';
import { Button } from './ui/button';
import { deleteAccount } from '@/actions/actions';

export default function DeleteAccountBtn({
  userEmail,
}: {
  userEmail: TAuthForm["email"];
}) {
  return (
    <Button onClick={async () => {
      const response = await deleteAccount(userEmail);
      if (response?.errorCode) {
        console.error({error: response});
      }
    }}>Delete Account</Button>
  );
}
