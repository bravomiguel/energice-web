import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import WaiverTerms from '@/components/waiver-terms';
// import { checkAuth, getUserById } from '@/lib/server-utils';
import ESigBlock from '@/components/e-sig-block';
import { checkAuth, getOrCreateProfileById } from '@/lib/server-utils';

export default async function Page() {
  const user = await checkAuth();
  const profile = await getOrCreateProfileById(user.id);

  if (!profile.name) redirect('/member-details');
  if (profile?.isWaiverSigned) redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <H1>Cold Plunge Waiver and Release of Liability</H1>
        <Subtitle>
          You must sign this Waiver and Release of Liability in order to use the cold plunge
        </Subtitle>
      </div>
      <WaiverTerms name={profile.name} />
      {/* <ESigAgreementCheckBox /> */}
      <ESigBlock name={profile.name} />
    </main>
  );
}
