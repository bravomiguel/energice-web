import { auth } from '@/lib/auth';
import DeleteAccountBtn from "@/components/delete-account-btn";
import SignOutBtn from "@/components/sign-out-btn";
import { getUser } from '@/actions/actions';

export default async function Page() {
  return (
    <main className="h-screen flex flex-col gap-4 py-4">
      <SignOutBtn />
      <DeleteAccountBtn />
    </main>
  )
}
