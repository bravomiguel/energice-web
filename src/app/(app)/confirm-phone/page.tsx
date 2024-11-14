import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import PhoneConfirmForm from '@/components/forms/phone-otp-form';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import { checkAuth, getUserProfileById } from '@/lib/server-utils';
import ConfirmPhoneDetails from '@/components/confirm-phone-details';

export default async function Page() {
  noStore();

  // auth check
  const user = await checkAuth();
  const profile = await getUserProfileById(user.id);

  // onboarding check
  // if (user?.isEmailConfirmed) redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <ConfirmPhoneDetails />
    </main>
  );
}
