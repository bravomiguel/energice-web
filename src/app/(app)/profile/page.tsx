import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import DeleteAccountBtn from "@/components/delete-account-btn";
import SignOutBtn from "@/components/sign-out-btn";

export default async function Page() {
  const session = await auth();
  const userEmail = session?.user?.email;

  return (
    <main className="h-screen flex flex-col gap-4 py-4">
      <SignOutBtn />
      {!!userEmail && <DeleteAccountBtn userEmail={userEmail} />}
    </main>
  )
}
