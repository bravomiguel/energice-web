import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import H1 from '@/components/h1';
import MemberDetailsForm from '@/components/forms/member-details-form';
import Subtitle from '@/components/subtitle';
// import { checkAuth, getUserById } from '@/lib/server-utils';

export default async function Page() {
  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Member details</H1>
        <Subtitle>Tell us some basic info about you</Subtitle>
      </div>
      <MemberDetailsForm />
    </main>
  );
}
