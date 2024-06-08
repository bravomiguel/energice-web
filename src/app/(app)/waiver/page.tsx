import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import WaiverTerms from '@/components/waiver-terms';
import { checkAuth, getUserById } from '@/lib/server-utils';

export default async function Page() {
  noStore();
  
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  if (!user?.firstName && !user?.lastName) redirect('/member-details');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Cold Plunge Waiver and Release of Liability</H1>
        <Subtitle>
          You must sign this waiver in order to use the cold plunge
        </Subtitle>
      </div>
      <WaiverTerms firstName={user.firstName} lastName={user.lastName} />
      {/* <ESigBlock /> */}
      {/* <ESigAgreementCheckBox /> */}
      {/* <ContinueButton /> */}
    </main>
  );
}
