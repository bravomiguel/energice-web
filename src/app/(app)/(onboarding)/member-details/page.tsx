import { redirect } from 'next/navigation';

import H1 from '@/components/h1';
import MemberDetailsForm from '@/components/forms/member-details-form';
import Subtitle from '@/components/subtitle';
import { checkAuth, getProfileById } from '@/lib/server-utils';
import prisma from '@/lib/db';

export default async function Page() {
  const user = await checkAuth();
  const profile = await getProfileById(user.id);

  if (profile?.isWaiverSigned) redirect('/');
  if (profile?.name) redirect('/waiver');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Member details</H1>
        <Subtitle>Tell us some basic info about you</Subtitle>
      </div>
      <MemberDetailsForm userName={user?.user_metadata?.name} />
    </main>
  );
}
