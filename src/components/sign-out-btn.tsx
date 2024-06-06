'use client';

import { signOutAction } from '@/actions/actions';
import { Button } from './ui/button';

export default function SignOutBtn() {
  return <Button onClick={async () => await signOutAction()}>Sign out</Button>;
}
