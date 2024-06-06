'use client';

import { AuthForm } from '@/lib/types';
import { Button } from './ui/button';
import { deleteAccount } from '@/actions/actions';

export default function DeleteAccountBtn({
  userEmail,
}: {
  userEmail: AuthForm["email"];
}) {
  return (
    <Button onClick={async () => await deleteAccount(userEmail)}>Delete Account</Button>
  );
}
